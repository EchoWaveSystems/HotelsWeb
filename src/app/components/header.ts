import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="apple-glass header-container">
      <div class="logo-area">
        <span class="logo-icon">🏨</span>
        <h1 class="logo-title">LuxeBook</h1>
      </div>
      <div class="nav-links">
        <span class="nav-subtitle">Hotel Finder & Insights</span>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      margin-bottom: 24px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.02);
      backdrop-filter: blur(20px) saturate(180%);
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      font-size: 1.8rem;
      line-height: 1;
    }
    .logo-title {
      font-family: var(--font-family-title);
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }
    .nav-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 400;
    }
  `]
})
export class HeaderComponent {}
