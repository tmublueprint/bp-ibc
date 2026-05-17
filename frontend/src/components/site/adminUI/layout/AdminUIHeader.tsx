import { useState } from 'react';
import './AdminUIHeader.css';
import { Button } from '../../../ui/Button';
import EyeIcon from '../../../ui/icons/adminUI/EyeIcon';
import CheckIcon from '../../../ui/icons/adminUI/CheckIcon';
import { saveAllPagesToDatabase } from '../../../../services/draftSaveService';
import { publishActiveDraft } from '../../../../services/publishService';

const SITE_ID = import.meta.env.VITE_SITE_ID ?? '1';

interface AdminUIHeaderProps {
    view: number;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}

function AdminUIHeader({ view, sidebarCollapsed, onToggleSidebar }: AdminUIHeaderProps) {
    const [saving, setSaving] = useState(false);
    const [deploying, setDeploying] = useState(false);

    const handleApplyChanges = async () => {
        setSaving(true);
        try {
            await saveAllPagesToDatabase();
        } catch (err) {
            console.error('[AdminUIHeader] Save failed:', err);
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = async () => {
        setDeploying(true);
        try {
            await saveAllPagesToDatabase();
            await publishActiveDraft(SITE_ID);
            window.open('/home', '_blank');
        } catch (err) {
            console.error('[AdminUIHeader] Deploy failed:', err);
        } finally {
            setDeploying(false);
        }
    };

    return (
        <div className="admin-header-container">
            <button className="admin-header-sidebar-toggle" onClick={onToggleSidebar} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                <HamburgerIcon />
            </button>
            <h1>Hi, Kelly!&nbsp;
                <span>
                    {view === 1 ? "You're editing pages now."
                    : view === 2 ? "You're editing images now."
                    : ""}
                </span>
            </h1>
            {view === 1 &&
                <div className="buttons-container">
                    <Button handleClick={handlePreview} variance="secondary" icon={<EyeIcon />} disabled={deploying}>
                        {deploying ? 'Publishing…' : 'Preview Site'}
                    </Button>
                    <Button handleClick={handleApplyChanges} variance="secondary" icon={<CheckIcon />} disabled={saving}>
                        {saving ? 'Saving…' : 'Apply Changes'}
                    </Button>
                </div>
            }
        </div>
    );
}

function HamburgerIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="3" y1="5.5"  x2="19" y2="5.5"  stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="11"   x2="19" y2="11"   stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="16.5" x2="19" y2="16.5" stroke="#1E2E5E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

export default AdminUIHeader;