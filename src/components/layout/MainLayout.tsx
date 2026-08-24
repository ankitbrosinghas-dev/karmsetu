import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, GitBranch, Map, 
  Target, HelpCircle, Activity, Award,
  Bell, User as UserIcon, LogOut, FileText, 
  Settings, Users, BrainCircuit
} from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { ChatAssistant } from '../ChatAssistant';
import { Logo } from '../Logo';
import { LanguageSelector } from '../LanguageSelector';

export function MainLayout() {
  const { currentUser, logout: storeLogout } = useAppStore();
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = async () => {
    storeLogout();
    await authLogout();
    navigate('/');
  };

  const learnerLinks = [
    { to: '/learner/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/learner/passport',         icon: BookOpen,        label: 'Competency Passport' },
    { to: '/learner/competency-graph', icon: GitBranch,       label: 'Competency Graph' },
    { to: '/learner/practice',         icon: Target,          label: 'Adaptive Practice' },
    { to: '/learner/why-weak',         icon: HelpCircle,      label: 'Why Am I Weak?' },
    { to: '/learner/create-quiz',      icon: BrainCircuit,    label: 'Create Quiz' },
    { to: '/learner/igot',             icon: Award,           label: 'iGOT Karmayogi' },
    { to: '/learner/igot/courses',     icon: Map,             label: 'Training Catalogue' },
  ];

  const managerLinks = [
    { to: '/manager/dashboard',    icon: LayoutDashboard, label: 'Intelligence Dashboard' },
    { to: '/manager/understanding',icon: Activity,        label: 'Overall Understanding' },
    { to: '/manager/heatmap',      icon: Activity,        label: 'Competency Heatmap' },
    { to: '/manager/materials',    icon: FileText,        label: 'Learning Materials' },
    { to: '/manager/question-generator', icon: BrainCircuit, label: 'AI Question Studio' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard',         icon: LayoutDashboard, label: 'System Dashboard' },
    { to: '/admin/understanding',      icon: Activity,        label: 'Overall Understanding' },
    { to: '/admin/integrations',       icon: Settings,        label: 'iGOT Integration' },
    { to: '/admin/users',              icon: Users,           label: 'User Management' },
  ];

  const links = currentUser.role === 'LEARNER' ? learnerLinks :
                currentUser.role === 'MANAGER' ? managerLinks : adminLinks;

  const roleColor = currentUser.role === 'LEARNER' ? '#6366F1'
                  : currentUser.role === 'MANAGER' ? '#8B5CF6'
                  : '#06B6D4';

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}>

      {/* ── TOP HEADER ─────────────────────────────────────────── */}
      <header style={{
        height: 52, background: 'rgba(10,10,10,.92)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo className="w-7 h-7" />
          <span style={{ fontWeight: 400, fontSize: 15, letterSpacing: '-.02em', color: '#fff' }}>
            Karm<span style={{ color: '#6366F1' }}>Setu</span>
          </span>
          <span style={{
            marginLeft: 8, padding: '2px 8px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            letterSpacing: '.12em', textTransform: 'uppercase',
            color: roleColor, border: `1px solid ${roleColor}33`,
            background: `${roleColor}11`,
          }}>
            {currentUser.role}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,.28)',
          }}>SIH26101 &middot; MoSPI</span>

          <LanguageSelector variant="header" />

          <button style={{ color: 'rgba(255,255,255,.40)', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Notifications">
            <Bell size={16} />
            <span style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, background: '#F43F5E', borderRadius: '50%', outline: '2px solid #0A0A0A' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,.08)' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: '#1A1A1F', border: '1px solid rgba(255,255,255,.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,.50)',
            }}>
              <UserIcon size={14} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.2 }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.40)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.06em', textTransform: 'uppercase' }}>
                {currentUser.designation}
              </div>
            </div>
            <button onClick={handleLogout} title="Log out" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,.35)', transition: 'color .2s', padding: 4,
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F43F5E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ──────────────────────────────────────────── */}
        <aside style={{
          width: 224, flexShrink: 0,
          background: '#0A0A0A',
          borderRight: '1px solid rgba(255,255,255,.07)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          <nav style={{ padding: '16px 10px', flex: 1 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.25)', padding: '8px 10px 12px',
            }}>Navigation</div>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 10px', marginBottom: 2,
                    fontSize: 13, fontWeight: isActive ? 400 : 300,
                    textDecoration: 'none', borderRadius: 0,
                    color: isActive ? '#fff' : 'rgba(255,255,255,.45)',
                    background: isActive ? 'rgba(99,102,241,.12)' : 'transparent',
                    borderLeft: isActive ? '2px solid #6366F1' : '2px solid transparent',
                    transition: 'all .18s',
                  })}
                  onMouseEnter={e => { if (!(e.currentTarget as HTMLElement).getAttribute('aria-current')) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.75)'; }}
                  onMouseLeave={e => { if (!(e.currentTarget as HTMLElement).getAttribute('aria-current')) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.45)'; }}
                >
                  <Icon size={14} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#0A0A0A', position: 'relative' }}>
          <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>
            <Outlet />
          </div>
          <ChatAssistant />
        </main>
      </div>
    </div>
  );
}
