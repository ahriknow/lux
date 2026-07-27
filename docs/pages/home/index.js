import { html, css, LuxElement, msg } from '../../lux.min.js';

const styles = css`
    :host {
        display: block;
    }
    .hero {
        text-align: center;
        padding: 100px 24px 20px;
        max-width: 800px;
        margin: 0 auto;
    }
    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgb(var(--lux-card));
        border: 1px solid rgb(var(--lux-border));
        border-radius: 999px;
        padding: 6px 16px;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .hero-badge .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgb(var(--lux-success));
    }
    .hero h1 {
        font-size: clamp(36px, 5vw, 56px);
        font-weight: 800;
        letter-spacing: -2px;
        line-height: 1.1;
        margin-bottom: 16px;
        color: rgb(var(--lux-text));
    }
    .hero h1 span {
        color: rgb(var(--lux-primary-400));
    }
    .hero p {
        font-size: 17px;
        color: rgb(var(--lux-text-secondary));
        max-width: 520px;
        margin: 0 auto 32px;
        line-height: 1.7;
    }
    .hero-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 48px;
    }
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 11px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
    }
    .btn-primary {
        background: rgb(var(--lux-primary-400));
        color: #fff;
    }
    .btn-primary:hover {
        background: rgb(var(--lux-primary-300));
        transform: translateY(-1px);
    }
    .btn-ghost {
        background: transparent;
        color: rgb(var(--lux-text));
        border: 1px solid rgb(var(--lux-border));
    }
    .btn-ghost:hover {
        border-color: rgb(var(--lux-text-secondary));
        background: rgb(var(--lux-card));
    }
    .hero-stats {
        display: flex;
        gap: 40px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 32px;
    }
    .stat {
        text-align: center;
    }
    .stat .num {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -1px;
        color: rgb(var(--lux-text));
    }
    .stat .num span {
        color: rgb(var(--lux-success));
        font-size: 18px;
        margin-left: 2px;
    }
    .stat .label {
        font-size: 12px;
        color: rgb(var(--lux-text-secondary));
        margin-top: 6px;
    }
    .hero-sizes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        max-width: 480px;
        margin: 0 auto 48px;
    }
    .size-card {
        text-align: center;
        padding: 12px 8px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
    }
    .size-val {
        font-size: 36px;
        font-weight: 800;
        letter-spacing: -1px;
        color: rgb(var(--lux-text));
        line-height: 1;
        display: inline;
    }
    .size-kb {
        font-size: 14px;
        font-weight: 600;
        color: rgb(var(--lux-success));
        display: inline;
        margin-left: 3px;
    }
    .size-name {
        font-size: 15px;
        font-weight: 500;
        color: rgb(var(--lux-text-secondary));
        margin-top: 8px;
    }
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        margin: 0 auto 48px;
        max-width: 800px;
        padding: 0 24px;
    }
    .feature-card {
        background: rgb(var(--lux-card));
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius);
        padding: 24px;
        transition: border-color 0.2s;
    }
    .feature-card:hover {
        border-color: rgb(var(--lux-primary-400));
    }
    .feature-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgb(var(--lux-primary-400) / 12%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        margin-bottom: 12px;
    }
    .feature-card h3 {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 6px;
        color: rgb(var(--lux-text));
    }
    .feature-card p {
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
        line-height: 1.5;
        margin: 0;
    }
    .footer {
        border-top: 1px solid rgb(var(--lux-border));
        padding: 24px;
        text-align: center;
        color: rgb(var(--lux-text-secondary));
        font-size: 13px;
    }
    .footer a {
        color: rgb(var(--lux-text-secondary));
    }
    .footer a:hover {
        color: rgb(var(--lux-text));
    }
`;

const features = [
    { icon: '⚡', titleKey: 'home.featReactive', descKey: 'home.featReactiveDesc' },
    { icon: '📦', titleKey: 'home.featStyles', descKey: 'home.featStylesDesc' },
    { icon: '🔁', titleKey: 'home.featRepeat', descKey: 'home.featRepeatDesc' },
    { icon: '🎯', titleKey: 'home.featBindings', descKey: 'home.featBindingsDesc' },
    { icon: '🧭', titleKey: 'home.featRouter', descKey: 'home.featRouterDesc' },
    { icon: '🪶', titleKey: 'home.featDeps', descKey: 'home.featDepsDesc' },
];

class PageHome extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <div class="hero">
                <img
                    src="favicon.svg"
                    alt="Lux"
                    width="160"
                    height="160"
                    style="margin:0 auto 32px;display:block"
                />
                <div class="hero-badge"><span class="dot"></span>${msg('home.badge')}</div>
                <h1>${msg('home.title')}<br /><span>${msg('home.title-sub')}</span></h1>
                <p>${msg('home.desc')}</p>
                <div class="hero-actions">
                    <a href="#/guide" class="btn btn-primary">${msg('home.getStarted')}</a>
                    <a href="#/components" class="btn btn-primary">${msg('nav.components')}</a>
                    <a href="https://github.com/ahriknow/lux" class="btn btn-ghost" target="_blank"
                        >GitHub</a
                    >
                </div>
                <div class="hero-sizes">
                    <div class="size-card">
                        <div class="size-val">4.5<span class="size-kb">KB</span></div>
                        <div class="size-name">Template</div>
                    </div>
                    <div class="size-card">
                        <div class="size-val">10.7<span class="size-kb">KB</span></div>
                        <div class="size-name">Core</div>
                    </div>
                    <div class="size-card">
                        <div class="size-val">4.1<span class="size-kb">KB</span></div>
                        <div class="size-name">Router</div>
                    </div>
                    <div class="size-card">
                        <div class="size-val">1.4<span class="size-kb">KB</span></div>
                        <div class="size-name">i18n</div>
                    </div>
                    <div class="size-card">
                        <div class="size-val">4.0<span class="size-kb">KB</span></div>
                        <div class="size-name">Theme</div>
                    </div>
                    <div class="size-card">
                        <div class="size-val">20.1<span class="size-kb">KB</span></div>
                        <div class="size-name">Full</div>
                    </div>
                </div>
            </div>

            <div class="features-grid">
                ${features.map(
                    (f) => html`
                        <div class="feature-card">
                            <div class="feature-icon">${f.icon}</div>
                            <h3>${msg(f.titleKey)}</h3>
                            <p>${msg(f.descKey)}</p>
                        </div>
                    `
                )}
            </div>
        `;
    }
}

export default PageHome;
