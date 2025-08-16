import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap'; 

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark'); // default theme is dark

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'auto') {
      applyAutoTheme();
    } else if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme('dark');
    }

    // Reapply auto theme when system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (localStorage.getItem('theme') === 'auto') {
        applyAutoTheme();
      }
    });
  }, []);

  const applyTheme = (mode) => {
    document.documentElement.setAttribute('data-bs-theme', mode);
    localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const applyAutoTheme = () => {
    // Check if the system is in dark mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', systemTheme);
    localStorage.setItem('theme', 'auto');
    setTheme('auto');
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="outline-secondary" id="theme-dropdown">
        Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => applyTheme('dark')}>Dark</Dropdown.Item>
        <Dropdown.Item onClick={() => applyTheme('light')}>Light</Dropdown.Item>
        <Dropdown.Item onClick={applyAutoTheme}>Auto (System)</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}