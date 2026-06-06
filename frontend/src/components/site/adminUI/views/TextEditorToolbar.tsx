import { useEffect, useRef, useState, useCallback } from 'react';
import './TextEditorToolbar.css';

import boldIcon         from '../../../../assets/editor/Bold.svg';
import italicIcon       from '../../../../assets/editor/Italic.svg';
import underlineIcon    from '../../../../assets/editor/Underline.svg';
import arrowUpIcon      from '../../../../assets/editor/arrow-up.svg';
import arrowDownIcon    from '../../../../assets/editor/arrow-down.svg';
import listIcon         from '../../../../assets/editor/List.svg';
import numberedListIcon from '../../../../assets/editor/Numbered List.svg';
import undoIcon         from '../../../../assets/editor/undo.svg';

const PRESET_COLORS = [
    { label: 'Forest Green', value: '#2E4A2E' },
    { label: 'Navy',         value: '#1E2E5E' },
    { label: 'Warm Gray',    value: '#C8C4BC' },
];

const FONTS = ['DM Sans', 'Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Courier New'];

type Alignment = 'Left' | 'Center' | 'Right' | 'Full';

const noSteal = (e: React.MouseEvent) => e.preventDefault();

function TextEditorToolbar() {
    const [isBold,           setIsBold]           = useState(false);
    const [isItalic,         setIsItalic]         = useState(false);
    const [isUnderline,      setIsUnderline]      = useState(false);
    const [isUnorderedList,  setIsUnorderedList]  = useState(false);
    const [isOrderedList,    setIsOrderedList]    = useState(false);
    const [align,            setAlign]            = useState<Alignment>('Left');
    const [fontSize,      setFontSize]      = useState(18);
    const [sizeEditMode,  setSizeEditMode]  = useState(false);
    const [pendingSizeStr, setPendingSizeStr] = useState('');

    const savedRangeRef  = useRef<Range | null>(null);
    const colorInputRef  = useRef<HTMLInputElement>(null);
    const fontSizeRef    = useRef(18);
    const pendingSizeRef = useRef('');

    const updateSize = (next: number) => {
        const clamped = Math.max(1, next);
        fontSizeRef.current = clamped;
        setFontSize(clamped);
    };

    const restoreSelection = useCallback(() => {
        const range = savedRangeRef.current;
        if (!range) return;
        const anchor = range.commonAncestorContainer;
        const el = (anchor.nodeType === Node.ELEMENT_NODE
            ? (anchor as HTMLElement)
            : anchor.parentElement
        )?.closest('[data-editable="true"]') as HTMLElement | null;
        if (!el) return;
        // In production, relatedTarget can be null even when focus moves to a
        // toolbar button, so the blur guard in UIContext may have already set
        // contentEditable='false'. Re-enable it here before every command so
        // execCommand always has a valid editable target.
        if (el.contentEditable !== 'true') {
            el.contentEditable = 'true';
        }
        el.focus({ preventScroll: true });
        const sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
    }, []);

    const cmd = useCallback((command: string, value?: string) => {
        restoreSelection();
        document.execCommand(command, false, value);
    }, [restoreSelection]);

    const cmdList = useCallback((command: string) => {
        restoreSelection();
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand(command, false, undefined);
        document.execCommand('styleWithCSS', false, 'true');
    }, [restoreSelection]);

    const applyFontFamily = useCallback((family: string) => {
        restoreSelection();
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        if (sel.isCollapsed) {
            document.execCommand('fontName', false, family);
            return;
        }

        const range = sel.getRangeAt(0);
        const anchor = range.commonAncestorContainer;
        const container: HTMLElement | null = anchor.nodeType === Node.TEXT_NODE
            ? (anchor as Text).parentElement
            : (anchor as HTMLElement);
        const editableRoot = container?.closest('[data-editable="true"]') as HTMLElement | null;

        if (container && container.tagName === 'SPAN' && container !== editableRoot && editableRoot) {
            container.style.fontFamily = family;
            const newRange = document.createRange();
            newRange.selectNodeContents(container);
            sel.removeAllRanges();
            sel.addRange(newRange);
            savedRangeRef.current = newRange.cloneRange();
            return;
        }

        const fragment = range.cloneContents();
        const tmp = document.createElement('div');
        const span = document.createElement('span');
        span.style.fontFamily = family;
        span.className = 'ibc-font-pending';
        span.appendChild(fragment);
        tmp.appendChild(span);
        document.execCommand('insertHTML', false, tmp.innerHTML);

        const inserted = document.querySelector('.ibc-font-pending') as HTMLElement | null;
        if (inserted) {
            inserted.classList.remove('ibc-font-pending');
            const newRange = document.createRange();
            newRange.selectNodeContents(inserted);
            sel.removeAllRanges();
            sel.addRange(newRange);
            savedRangeRef.current = newRange.cloneRange();
        }
    }, [restoreSelection]);

    const applyFontSize = useCallback((px: number) => {
        restoreSelection();
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

        const range = sel.getRangeAt(0);
        const anchor = range.commonAncestorContainer;
        const container: HTMLElement | null = anchor.nodeType === Node.TEXT_NODE
            ? (anchor as Text).parentElement
            : (anchor as HTMLElement);
        const editableRoot = container?.closest('[data-editable="true"]') as HTMLElement | null;

        if (container && container.tagName === 'SPAN' && container !== editableRoot && editableRoot) {
            container.style.fontSize = `${px}px`;
            const newRange = document.createRange();
            newRange.selectNodeContents(container);
            sel.removeAllRanges();
            sel.addRange(newRange);
            savedRangeRef.current = newRange.cloneRange();
            fontSizeRef.current = px;
            setFontSize(px);
            return;
        }

        const fragment = range.cloneContents();
        const wrapper = document.createElement('div');
        const span = document.createElement('span');
        span.style.fontSize = `${px}px`;
        span.className = 'ibc-size-pending';
        span.appendChild(fragment);
        wrapper.appendChild(span);
        document.execCommand('insertHTML', false, wrapper.innerHTML);

        const inserted = document.querySelector('.ibc-size-pending') as HTMLElement | null;
        if (inserted) {
            inserted.classList.remove('ibc-size-pending');
            const newRange = document.createRange();
            newRange.selectNodeContents(inserted);
            sel.removeAllRanges();
            sel.addRange(newRange);
            savedRangeRef.current = newRange.cloneRange();
        }
        fontSizeRef.current = px;
        setFontSize(px);
    }, [restoreSelection]);

    const handleUndo = useCallback(() => {
        const range = savedRangeRef.current;
        if (range) {
            const anchor = range.commonAncestorContainer;
            const el = (anchor.nodeType === Node.ELEMENT_NODE
                ? (anchor as HTMLElement)
                : anchor.parentElement
            )?.closest('[data-editable="true"]') as HTMLElement | null;
            el?.focus({ preventScroll: true });
        }
        document.execCommand('undo');
    }, []);

    useEffect(() => {
        const sync = () => {
            const sel = window.getSelection();
            const anchorNode = sel?.anchorNode;
            const el: HTMLElement | null = anchorNode
                ? (anchorNode.nodeType === Node.ELEMENT_NODE
                    ? (anchorNode as HTMLElement)
                    : (anchorNode as Text).parentElement)
                : null;
            if (!el || !(el.closest('[data-editable="true"]') || el.isContentEditable)) return;

            if (sel && sel.rangeCount > 0) {
                savedRangeRef.current = sel.getRangeAt(0).cloneRange();
            }

            setIsBold(document.queryCommandState('bold'));
            setIsItalic(document.queryCommandState('italic'));
            setIsUnderline(document.queryCommandState('underline'));
            setIsUnorderedList(!!el.closest('ul'));
            setIsOrderedList(!!el.closest('ol'));

            if      (document.queryCommandState('justifyCenter')) setAlign('Center');
            else if (document.queryCommandState('justifyRight'))  setAlign('Right');
            else if (document.queryCommandState('justifyFull'))   setAlign('Full');
            else                                                   setAlign('Left');

            const size = parseFloat(window.getComputedStyle(el).fontSize);
            if (!isNaN(size)) {
                fontSizeRef.current = Math.round(size);
                setFontSize(Math.round(size));
            }
        };
        document.addEventListener('selectionchange', sync);
        return () => document.removeEventListener('selectionchange', sync);
    }, []);

    useEffect(() => {
        document.execCommand('styleWithCSS', false, 'true');
    }, []);

    useEffect(() => {
        if (!sizeEditMode) return;
        const handleOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.toolbar-size-input')) {
                setSizeEditMode(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [sizeEditMode]);

    useEffect(() => {
        if (!sizeEditMode) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                e.stopPropagation();
                const next = pendingSizeRef.current === '0' ? e.key : pendingSizeRef.current + e.key;
                pendingSizeRef.current = next;
                setPendingSizeStr(next);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                e.stopPropagation();
                const next = pendingSizeRef.current.length > 1
                    ? pendingSizeRef.current.slice(0, -1)
                    : '0';
                pendingSizeRef.current = next;
                setPendingSizeStr(next);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                const n = parseInt(pendingSizeRef.current, 10);
                if (!isNaN(n) && n > 0) applyFontSize(Math.max(1, n));
                setSizeEditMode(false);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setSizeEditMode(false);
            }
        };
        document.addEventListener('keydown', handleKey, true);
        return () => document.removeEventListener('keydown', handleKey, true);
    }, [sizeEditMode, applyFontSize]);

    const handleSizeUp   = () => { const next = fontSizeRef.current + 1; updateSize(next); applyFontSize(next); };
    const handleSizeDown = () => { const next = Math.max(1, fontSizeRef.current - 1); updateSize(next); applyFontSize(next); };

    const handleSizeDivClick = () => {
        setSizeEditMode(true);
        const s = fontSize.toString();
        setPendingSizeStr(s);
        pendingSizeRef.current = s;
    };

    const handleBold      = () => { cmd('bold');      setIsBold(b => !b); };
    const handleItalic    = () => { cmd('italic');    setIsItalic(i => !i); };
    const handleUnderline = () => { cmd('underline'); setIsUnderline(u => !u); };

    const handleAlign = (a: Alignment) => {
        const cmds: Record<Alignment, string> = {
            Left: 'justifyLeft', Center: 'justifyCenter',
            Right: 'justifyRight', Full: 'justifyFull',
        };
        cmd(cmds[a]);
        setAlign(a);
    };

    return (
        <div className="toolbar-wrapper">
            <div className="text-editor-toolbar">

                {/* Font */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Font</span>
                    <div className="toolbar-font-wrapper">
                        <select className="toolbar-font-select" onChange={e => applyFontFamily(e.target.value)} defaultValue="DM Sans">
                            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <span className="toolbar-font-chevron"><ChevronDown /></span>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Size */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Size</span>
                    <div className="toolbar-size-row">
                        <div
                            className={`toolbar-size-input${sizeEditMode ? ' toolbar-size-input--active' : ''}`}
                            onMouseDown={noSteal}
                            onClick={handleSizeDivClick}
                            title="Click, type a size, then press Enter"
                        >
                            {sizeEditMode ? pendingSizeStr : fontSize}
                        </div>
                        <div className="toolbar-size-arrows">
                            <button className="toolbar-btn toolbar-arrow-btn" onMouseDown={noSteal} onClick={handleSizeUp}   title="Increase">
                                <img src={arrowUpIcon}   className="toolbar-arrow-icon" alt="" />
                            </button>
                            <button className="toolbar-btn toolbar-arrow-btn" onMouseDown={noSteal} onClick={handleSizeDown} title="Decrease">
                                <img src={arrowDownIcon} className="toolbar-arrow-icon" alt="" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Style */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Style</span>
                    <div className="toolbar-row">
                        <button className={`toolbar-btn${isBold      ? ' toolbar-btn--active' : ''}`} onMouseDown={noSteal} onClick={handleBold}      title="Bold">
                            <img src={boldIcon}      className="toolbar-icon" alt="Bold" />
                        </button>
                        <button className={`toolbar-btn${isItalic    ? ' toolbar-btn--active' : ''}`} onMouseDown={noSteal} onClick={handleItalic}    title="Italic">
                            <img src={italicIcon}    className="toolbar-icon" alt="Italic" />
                        </button>
                        <button className={`toolbar-btn${isUnderline ? ' toolbar-btn--active' : ''}`} onMouseDown={noSteal} onClick={handleUnderline} title="Underline">
                            <img src={underlineIcon} className="toolbar-icon" alt="Underline" />
                        </button>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Colour */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Colour</span>
                    <div className="toolbar-colour-row">
                        {PRESET_COLORS.map(c => (
                            <button key={c.value} className="toolbar-color-swatch"
                                style={{ backgroundColor: c.value }}
                                onMouseDown={noSteal}
                                onClick={() => cmd('foreColor', c.value)}
                                title={c.label}
                            />
                        ))}
                        <button className="toolbar-color-custom" title="Custom colour"
                            onMouseDown={noSteal}
                            onClick={() => colorInputRef.current?.click()}
                        >
                            <ChevronDown />
                        </button>
                        <input ref={colorInputRef} type="color" className="toolbar-color-input"
                            onFocus={() => {
                                // OS color dialog steals focus, blurring the editable element and
                                // setting contentEditable='false'. Re-focus it so the color applies.
                                const range = savedRangeRef.current;
                                if (!range) return;
                                const anchor = range.commonAncestorContainer;
                                const el = (anchor.nodeType === Node.ELEMENT_NODE
                                    ? (anchor as HTMLElement)
                                    : anchor.parentElement
                                )?.closest('[data-editable="true"]') as HTMLElement | null;
                                if (el && el.contentEditable !== 'true') {
                                    el.contentEditable = 'true';
                                }
                            }}
                            onChange={e => cmd('foreColor', e.target.value)} />
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Align */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Align</span>
                    <div className="toolbar-row">
                        {(['Left', 'Center', 'Right', 'Full'] as Alignment[]).map(a => (
                            <button key={a}
                                className={`toolbar-btn${align === a ? ' toolbar-btn--active' : ''}`}
                                onMouseDown={noSteal}
                                onClick={() => handleAlign(a)}
                                title={`Align ${a}`}
                            >
                                <AlignIcon type={a} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Lists */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Lists</span>
                    <div className="toolbar-row">
                        <button className={`toolbar-btn${isUnorderedList ? ' toolbar-btn--active' : ''}`} onMouseDown={noSteal} onClick={() => cmdList('insertUnorderedList')} title="Bullet list">
                            <img src={listIcon}         className="toolbar-icon" alt="Bullet list" />
                        </button>
                        <button className={`toolbar-btn${isOrderedList ? ' toolbar-btn--active' : ''}`} onMouseDown={noSteal} onClick={() => cmdList('insertOrderedList')}   title="Numbered list">
                            <img src={numberedListIcon} className="toolbar-icon" alt="Numbered list" />
                        </button>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Undo */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Undo</span>
                    <div className="toolbar-row">
                        <button className="toolbar-btn" onMouseDown={noSteal} onClick={handleUndo} title="Undo">
                            <img src={undoIcon} className="toolbar-icon" alt="Undo" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

/* ─── icons ─── */

function ChevronDown() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#1E2E5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function AlignIcon({ type }: { type: Alignment }) {
    const shortX2 = { Left: 13, Center: 16, Right: 18, Full: 18 }[type];
    const shortX1 = { Left: 2,  Center: 4,  Right: 6,  Full: 2  }[type];
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="2" y1="3.5"  x2="16" y2="3.5"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1={shortX1} y1="7"    x2={shortX2} y2="7"    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="2" y1="10.5" x2="16" y2="10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1={shortX1} y1="14"   x2={shortX2} y2="14"   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
    );
}

export default TextEditorToolbar;
