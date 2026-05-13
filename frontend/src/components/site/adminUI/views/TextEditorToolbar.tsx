import { useEffect, useRef, useState, useCallback } from 'react';
import './TextEditorToolbar.css';

const PRESET_COLORS = [
    { label: 'Forest Green', value: '#2E4A2E' },
    { label: 'Navy',         value: '#1E2E5E' },
    { label: 'Warm Gray',    value: '#C8C4BC' },
];

const FONTS = ['DM Sans', 'Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Courier New'];

type Alignment = 'Left' | 'Center' | 'Right' | 'Full';

// Prevent toolbar button clicks from stealing the page-content selection.
const noSteal = (e: React.MouseEvent) => e.preventDefault();

function TextEditorToolbar() {
    const [isBold,        setIsBold]        = useState(false);
    const [isItalic,      setIsItalic]      = useState(false);
    const [isUnderline,   setIsUnderline]   = useState(false);
    const [align,         setAlign]         = useState<Alignment>('Left');
    const [fontSize,      setFontSize]      = useState(18);
    const [sizeEditMode,  setSizeEditMode]  = useState(false);
    const [pendingSizeStr, setPendingSizeStr] = useState('');

    // Tracks the last known selection inside editable content.
    // Restored before every command so focus-stealing controls (select, color input)
    // still apply to the correct text.
    const savedRangeRef  = useRef<Range | null>(null);
    const colorInputRef  = useRef<HTMLInputElement>(null);
    const fontSizeRef    = useRef(18);
    const pendingSizeRef = useRef('');

    const updateSize = (next: number) => {
        const clamped = Math.max(1, next);
        fontSizeRef.current = clamped;
        setFontSize(clamped);
    };

    // Re-focus the editable element and restore the saved selection so that
    // execCommand has a valid contentEditable target (needed after focus-stealing
    // controls like <select> or <input type="color"> take focus).
    const restoreSelection = useCallback(() => {
        const range = savedRangeRef.current;
        if (!range) return;
        const anchor = range.commonAncestorContainer;
        const el = (anchor.nodeType === Node.ELEMENT_NODE
            ? (anchor as HTMLElement)
            : anchor.parentElement
        )?.closest('[data-editable="true"]') as HTMLElement | null;
        el?.focus({ preventScroll: true });
        const sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
    }, []);

    const cmd = useCallback((command: string, value?: string) => {
        restoreSelection();
        document.execCommand(command, false, value);
    }, [restoreSelection]);

    // insertHTML with inline style so the change wins over page-level CSS class rules
    // that override the <font face="..."> tag produced by execCommand('fontName').
    const applyFontFamily = useCallback((family: string) => {
        restoreSelection();
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        // Collapsed cursor: use execCommand so the sticky font applies to new typing.
        if (sel.isCollapsed) {
            document.execCommand('fontName', false, family);
            return;
        }

        const range = sel.getRangeAt(0);
        const anchor = range.commonAncestorContainer;

        // Find the immediate element that contains the selection.
        const container: HTMLElement | null = anchor.nodeType === Node.TEXT_NODE
            ? (anchor as Text).parentElement
            : (anchor as HTMLElement);

        const editableRoot = container?.closest('[data-editable="true"]') as HTMLElement | null;

        // When the selection sits inside a single styled span (bold, italic, etc.), adding
        // font-family via insertHTML causes Chrome (with styleWithCSS=true) to run a
        // normalization pass that strips the font-family from the reinserted span.
        // Directly mutating the span's inline style avoids the normalization entirely.
        if (container && container.tagName === 'SPAN' && container !== editableRoot && editableRoot) {
            container.style.fontFamily = family;
            const newRange = document.createRange();
            newRange.selectNodeContents(container);
            sel.removeAllRanges();
            sel.addRange(newRange);
            savedRangeRef.current = newRange.cloneRange();
            return;
        }

        // Plain text or cross-element selection — wrap selected content in a new font span.
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

        // When the selection is inside a single styled span, mutate font-size directly.
        // insertHTML here causes Chrome to normalise away the outer span's styles
        // (bold, italic, font-family, etc.) — the same issue as applyFontFamily.
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

        // Plain text or cross-element selection — wrap in a new size span via insertHTML.
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
        // Focus the editable element so execCommand('undo') targets it,
        // but don't restore the saved range — it may be stale after prior undos.
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

    // Sync toolbar active states with cursor/selection position.
    useEffect(() => {
        const sync = () => {
            const sel = window.getSelection();
            const anchorNode = sel?.anchorNode;

            // If anchorNode is an element (e.g. after selectNodeContents on a span),
            // use it directly so getComputedStyle reads that element's own font-size.
            // If it's a text node, use its parent element as usual.
            const el: HTMLElement | null = anchorNode
                ? (anchorNode.nodeType === Node.ELEMENT_NODE
                    ? (anchorNode as HTMLElement)
                    : (anchorNode as Text).parentElement)
                : null;

            // Only update toolbar state when the cursor is inside editable page content.
            // Clicking the canvas background or toolbar controls must not reset anything.
            if (!el || !(el.closest('[data-editable="true"]') || el.isContentEditable)) return;

            // Persist the range so toolbar controls can restore it before applying commands.
            if (sel && sel.rangeCount > 0) {
                savedRangeRef.current = sel.getRangeAt(0).cloneRange();
            }

            setIsBold(document.queryCommandState('bold'));
            setIsItalic(document.queryCommandState('italic'));
            setIsUnderline(document.queryCommandState('underline'));

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

    // Make all execCommands (bold, italic, underline, foreColor) emit CSS inline
    // styles instead of semantic elements (<b>, <i>, <u>, <font>). This lets Chrome
    // merge new properties into an existing span's style attribute rather than
    // wrapping/stripping outer spans — so font-family is preserved when bold is stacked on top.
    useEffect(() => {
        document.execCommand('styleWithCSS', false, 'true');
    }, []);

    // Exit size-edit mode when the user clicks anywhere outside the size div.
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

    // Capture keystrokes at document level while size-edit mode is active so
    // that digits/Backspace/Enter never reach the contentEditable canvas and
    // the canvas selection stays visible throughout.
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
        document.addEventListener('keydown', handleKey, true); // capture phase
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
                    <select className="toolbar-font-select" onChange={e => applyFontFamily(e.target.value)} defaultValue="DM Sans">
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                <div className="toolbar-divider" />

                {/* Size — click to enter edit mode, type digits, press Enter to apply */}
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
                            <button className="toolbar-btn toolbar-arrow-btn" onMouseDown={noSteal} onClick={handleSizeUp}   title="Increase">▲</button>
                            <button className="toolbar-btn toolbar-arrow-btn" onMouseDown={noSteal} onClick={handleSizeDown} title="Decrease">▼</button>
                        </div>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Style */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Style</span>
                    <div className="toolbar-row">
                        <button className={`toolbar-btn toolbar-style-bold${isBold ? ' toolbar-btn--active' : ''}`}
                            onMouseDown={noSteal} onClick={handleBold} title="Bold"><strong>B</strong></button>
                        <button className={`toolbar-btn toolbar-style-italic${isItalic ? ' toolbar-btn--active' : ''}`}
                            onMouseDown={noSteal} onClick={handleItalic} title="Italic"><em>I</em></button>
                        <button className={`toolbar-btn toolbar-style-underline${isUnderline ? ' toolbar-btn--active' : ''}`}
                            onMouseDown={noSteal} onClick={handleUnderline} title="Underline"><u>U</u></button>
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
                        <button className="toolbar-btn" onMouseDown={noSteal} onClick={() => cmd('insertUnorderedList')} title="Bullet list"><BulletListIcon /></button>
                        <button className="toolbar-btn" onMouseDown={noSteal} onClick={() => cmd('insertOrderedList')}   title="Numbered list"><NumberedListIcon /></button>
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Undo */}
                <div className="toolbar-group">
                    <span className="toolbar-label">Undo</span>
                    <div className="toolbar-row">
                        <button className="toolbar-btn" onMouseDown={noSteal} onClick={handleUndo} title="Undo"><UndoIcon /></button>
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

function BulletListIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="3" cy="4.5" r="1.4" fill="currentColor"/>
            <line x1="6.5" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="3" cy="9"   r="1.4" fill="currentColor"/>
            <line x1="6.5" y1="9"   x2="16" y2="9"   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="3" cy="13.5" r="1.4" fill="currentColor"/>
            <line x1="6.5" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
    );
}

function NumberedListIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <text x="1" y="6.5" fontSize="5.5" fontWeight="700" fill="currentColor" fontFamily="sans-serif">1.</text>
            <line x1="6.5" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <text x="1" y="11"  fontSize="5.5" fontWeight="700" fill="currentColor" fontFamily="sans-serif">2.</text>
            <line x1="6.5" y1="9"   x2="16" y2="9"   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <text x="1" y="15.5" fontSize="5.5" fontWeight="700" fill="currentColor" fontFamily="sans-serif">3.</text>
            <line x1="6.5" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
    );
}

function UndoIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 6.5C4.3 4.2 6.8 2.5 9.7 2.5C13.8 2.5 17 5.7 17 9.8S13.8 17 9.7 17C6.8 17 4.3 15.3 3 13"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <polyline points="1,3.5 3,6.5 5.5,5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default TextEditorToolbar;
