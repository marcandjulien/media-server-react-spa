// icons
import DashboardIcon from '@material-ui/icons/BarChartOutlined';
import CodeIcon from '@material-ui/icons/CodeOutlined';
import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import PublicIcon from '@material-ui/icons/LockOpenOutlined';
import PrivateIcon from '@material-ui/icons/LockOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
// interface
import RouteItem from '../model/RouteItem.model';
import Chapter from '../pages/Chapter';
import CodeEditor from '../pages/CodeEditor';
import Dashboard from '../pages/Dashboard';
import GHPrivate from '../pages/GitHub/PrivateRepo';
import GHPublic from '../pages/GitHub/PublicRepo';
import Home from '../pages/Home';
import Reader from '../pages/Reader';
import Settings from '../pages/Settings';
import Stories from '../pages/Stories';
import Story from '../pages/Story';
// components

// define app routes
export const routes: Array<RouteItem> = [
  {
    key: 'router-stories',
    title: 'Stories',
    tooltip: 'Stories',
    path: '/stories',
    enabled: true,
    component: Stories,
    icon: HomeIcon,
  },
  {
    key: 'router-chapter',
    title: 'Chapter',
    tooltip: 'Chapter',
    path: '/chapter/:chapterUuid',
    enabled: true,
    component: Chapter,
    icon: HomeIcon,
    hidden: true,
  },
  {
    key: 'router-reader',
    title: 'Reader',
    tooltip: 'Reader',
    path: '/reader',
    enabled: true,
    component: Reader,
    icon: HomeIcon,
    hidden: true,
  },
  {
    key: 'router-story',
    title: 'Story',
    tooltip: 'Story',
    path: '/story/:storyUuid',
    enabled: true,
    component: Story,
    icon: HomeIcon,
    appendDivider: true,
    hidden: true,
  },
  {
    key: 'router-home',
    title: 'Home',
    tooltip: 'Home',
    path: '/',
    enabled: true,
    component: Home,
    icon: HomeIcon,
    appendDivider: true,
  },
  {
    key: 'router-dashboard',
    title: 'Dashboard',
    tooltip: 'Dashboard',
    path: '/dashboard',
    enabled: true,
    component: Dashboard,
    icon: DashboardIcon,
  },
  {
    key: 'router-gh',
    title: 'GitHub',
    tooltip: 'GitHub',
    enabled: true,
    icon: GitHubIcon,
    subRoutes: [
      {
        key: 'router-gh-private',
        title: 'Private Repos',
        tooltip: 'Private Repos',
        path: '/gh/private',
        enabled: true,
        component: GHPrivate,
        icon: PrivateIcon,
      },
      {
        key: 'router-gh-public',
        title: 'Public Repos',
        tooltip: 'Public Repos',
        path: '/gh/public',
        enabled: false,
        component: GHPublic,
        icon: PublicIcon,
      },
    ],
  },
  {
    key: 'router-code',
    title: 'Code Editor',
    tooltip: 'Code Editor',
    path: '/code-editor',
    enabled: true,
    component: CodeEditor,
    icon: CodeIcon,
    appendDivider: true,
  },
  {
    key: 'router-settings',
    title: 'Settings',
    tooltip: 'Settings',
    path: '/settings',
    enabled: true,
    component: Settings,
    icon: SettingsIcon,
  },
];
