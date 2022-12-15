import { IoMdSettings } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { GrClose, GrMenu, GrLogout } from 'react-icons/gr';
import { MouseEventHandler, useRef, useState } from 'react';
const Sidebar = () => {
  const [menuState, setMenuState] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuClick = () => {
    setMenuState((prev) => !prev);
    // sidebarRef.current?.classList.toggle('open');
  };
  return (
    <div className="sidebarwrap">
      <header className="header">
        <button
          className="menu-icon-btn"
          data-menu-icon-btn
          onClick={menuClick}
        >
          {menuState ? <GrClose size={30} /> : <GrMenu size={30} />}
          {/* <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            className="menu-icon"
          >
            <g>
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </g>
          </svg> */}
        </button>
      </header>

      <div className={menuState ? 'container open' : 'container'}>
        <aside
          className={menuState ? 'sidebar open' : 'sidebar'}
          data-sidebar
          ref={sidebarRef}
        >
          {/* <div className="top-sidebar">
            <a href="#" className="channel-logo"></a>
            <div className="hidden-sidebar your-channel">Your channel</div>
            <div className="hidden-sidebar channel-name">
              Web Dev Simplified
            </div>
          </div> */}
          <div className="middle-sidebar">
            <ul className="sidebar-list">
              <li className="sidebar-list-item" data-icon="setting">
                <a href="#" className="sidebar-link">
                  <span className="sideiconwrap">
                    <IoMdSettings className="sidebar-icon" size="25" />
                  </span>
                  <div className="hidden-sidebar">Settings</div>
                </a>
              </li>
              <li className="sidebar-list-item" data-icon="user">
                <a href="#" className="sidebar-link">
                  <span className="sideiconwrap">
                    <FaUserAlt className="sidebar-icon" size="25" />
                  </span>

                  <div className="hidden-sidebar">User</div>
                </a>
              </li>
              <li className="sidebar-list-item" data-icon="logout">
                <a href="#" className="sidebar-link">
                  <span className="sideiconwrap">
                    <GrLogout className="sidebar-icon" size="25" />
                  </span>
                  <div className="hidden-sidebar">Logout</div>
                </a>
              </li>
              {/* <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Analytics</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Comments</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Subtitles</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M10.08 10.86c.05-.33.16-.62.3-.87s.34-.46.59-.62c.24-.15.54-.22.91-.23.23.01.44.05.63.13.2.09.38.21.52.36s.25.33.34.53.13.42.14.64h1.79c-.02-.47-.11-.9-.28-1.29s-.4-.73-.7-1.01-.66-.5-1.08-.66-.88-.23-1.39-.23c-.65 0-1.22.11-1.7.34s-.88.53-1.2.92-.56.84-.71 1.36S8 11.29 8 11.87v.27c0 .58.08 1.12.23 1.64s.39.97.71 1.35.72.69 1.2.91 1.05.34 1.7.34c.47 0 .91-.08 1.32-.23s.77-.36 1.08-.63.56-.58.74-.94.29-.74.3-1.15h-1.79c-.01.21-.06.4-.15.58s-.21.33-.36.46-.32.23-.52.3c-.19.07-.39.09-.6.1-.36-.01-.66-.08-.89-.23-.25-.16-.45-.37-.59-.62s-.25-.55-.3-.88-.08-.67-.08-1v-.27c0-.35.03-.68.08-1.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Copyright</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Monetization</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Customization</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Audio Library</div>
                </a>
              </li> */}
            </ul>
          </div>
          {/* <div className="bottom-sidebar">
            <ul className="sidebar-list">
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Settings</div>
                </a>
              </li>
              <li className="sidebar-list-item">
                <a href="#" className="sidebar-link">
                  <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                    className="sidebar-icon"
                  >
                    <g>
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"></path>
                    </g>
                  </svg>
                  <div className="hidden-sidebar">Send Feedback</div>
                </a>
              </li>
            </ul>
          </div> */}
        </aside>
      </div>
      <style jsx>{`
        $content_opacity: 1s;
        .sidebarwrap {
          position: fixed;
          right: 0;
          top: 0;
          border-radius: 4px;
        }

        .header {
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          background-color: white;
          box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.4);
          width: 50px;
          border-radius: 4px;
        }

        .menu-icon-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0 auto;
          outline: none;
          cursor: pointer;
        }

        .menu-icon {
          width: 25px;
          height: 25px;

          cursor: pointer;
        }

        .menu-icon:hover {
        }

        .sidebar {
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;

          position: sticky;
          left: 0;
        }

        .sidebar .hidden-sidebar {
          opacity: 0;
          width: 0;
          transition: opacity $content_opacity ease-in-out;
        }

        .sidebar.open .hidden-sidebar {
          width: 100%;
          height: auto;
          opacity: 1;
        }

        .sidebar .top-sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sidebar .channel-logo {
          display: block;
          width: 30px;
          height: 30px;
          transition: 2s ease-in-out;
        }

        .sidebar.open .channel-logo {
          width: 90px;
          height: 90px;
        }

        .sidebar .channel-logo > img {
          width: 100%;
          height: 100%;
        }

        .middle-sidebar {
          overflow-y: auto;
          overflow-x: hidden;
          flex-grow: 1;
          margin: 1rem 0;
        }

        .middle-sidebar,
        .bottom-sidebar {
          width: 100%;
        }

        .container {
          background-color: #e9ecef;
          position: absolute;
          display: flex;
          width: 200px;
          transition: 0.4s;
          border-radius: 4px;
          &.open {
            translate: -140px;
          }
        }

        .content {
          margin: 1rem;
        }

        .sidebar-list {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          list-style: none;

          > li:nth-child(3) .sideiconwrap {
            margin-left: 0.8rem;
          }
        }

        .sidebar.open .sidebar-link {
          justify-content: flex-start;
        }

        .sidebar-icon {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
        }
        .sideiconwrap {
          margin-left: 0.6rem;
        }
        .sidebar-list .hidden-sidebar {
          margin-left: 1.5rem;
          white-space: nowrap;
        }

        .sidebar-link {
          display: flex;
          width: 100%;
          padding: 0.5rem 0;

          text-decoration: none;
          align-items: center;
        }

        .sidebar-list-item {
          position: relative;
          width: 100%;
        }

        .sidebar-list-item.active {
          fill: rgb(204, 0, 0);
          background-color: rgb(244, 244, 244);
        }

        .sidebar-list-item:hover {
          background-color: rgb(138, 122, 122);
          &::before {
            opacity: 100;
          }
        }

        .sidebar-list-item::before {
          content: '';
          background-color: rgb(204, 0, 0);
          height: 100%;
          left: 0;
          width: 3px;
          position: absolute;
          opacity: 0;
        }

        .your-channel {
          font-size: 0.75rem;
          font-weight: bold;
          margin-bottom: 0.15rem;
          margin-top: 0.5rem;
        }

        .channel-name {
          font-size: 0.75rem;
        }

        .sidebar .top-sidebar {
          height: 30px;
          transition: height $content_opacity ease-in-out;
        }

        .sidebar.open .top-sidebar {
          height: 125px;
        }

        .sidebar .top-sidebar .hidden-sidebar {
          text-align: center;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
