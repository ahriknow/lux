import { html, css, LuxElement } from '../../lux.min.js';
import { msg } from '../../lux.min.js';
import '../../complib/lux-code.min.js';
import '../../complib/lux-table.min.js';

const styles = css`
    :host {
        display: block;
    }
    h1 {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -1px;
        margin-bottom: 8px;
        color: rgb(var(--lux-text));
    }
    h2 {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin-top: 48px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgb(var(--lux-border));
        color: rgb(var(--lux-text));
    }
    h3 {
        font-size: 16px;
        font-weight: 600;
        margin-top: 32px;
        margin-bottom: 8px;
        color: rgb(var(--lux-text));
    }
    p {
        color: rgb(var(--lux-text-secondary));
        font-size: 15px;
        margin-bottom: 16px;
        line-height: 1.7;
    }
    code {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.88em;
        background: rgb(var(--lux-bg-alt));
        padding: 2px 6px;
        border-radius: 4px;
    }
    .callout {
        background: rgb(var(--lux-primary-400) / 8%);
        border-left: 3px solid rgb(var(--lux-primary-400));
        border-radius: 0 8px 8px 0;
        padding: 14px 18px;
        margin: 20px 0;
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
    }
    .callout strong {
        color: rgb(var(--lux-text));
    }
`;

class PageApi extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <span
                style="display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgb(var(--lux-primary-400));margin-bottom:12px"
                >Reference</span
            >
            <h1>${msg('api.title')}</h1>

            <h2>LuxElement</h2>
            <p>${msg('api.luxElement.desc')}</p>

            <h3>${msg('api.staticProps')}</h3>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.type')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>properties</code></td>
                            <td>Object</td>
                            <td>${msg('api.prop.properties')}</td>
                        </tr>
                        <tr>
                            <td><code>styles</code></td>
                            <td>String / CSSResult / Array</td>
                            <td>${msg('api.prop.styles')}</td>
                        </tr>
                        <tr>
                            <td><code>shadowRootOptions</code></td>
                            <td>Object</td>
                            <td>${msg('api.prop.shadowRootOptions')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h3>${msg('api.lifecycle')}</h3>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('api.hook')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>connectedCallback()</code></td>
                            <td>${msg('api.hook.connected')}</td>
                        </tr>
                        <tr>
                            <td><code>disconnectedCallback()</code></td>
                            <td>${msg('api.hook.disconnected')}</td>
                        </tr>
                        <tr>
                            <td><code>shouldUpdate(changed)</code></td>
                            <td>${msg('api.hook.shouldUpdate')}</td>
                        </tr>
                        <tr>
                            <td><code>willUpdate(changed)</code></td>
                            <td>${msg('api.hook.willUpdate')}</td>
                        </tr>
                        <tr>
                            <td><code>update(changed)</code></td>
                            <td>${msg('api.hook.update')}</td>
                        </tr>
                        <tr>
                            <td><code>firstUpdated(changed)</code></td>
                            <td>${msg('api.hook.firstUpdated')}</td>
                        </tr>
                        <tr>
                            <td><code>updated(changed)</code></td>
                            <td>${msg('api.hook.updated')}</td>
                        </tr>
                        <tr>
                            <td><code>propertyChangedCallback(name, old, val)</code></td>
                            <td>${msg('api.hook.propertyChanged')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h3>${msg('api.instanceMethods')}</h3>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('api.method')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>render()</code></td>
                            <td>${msg('api.method.render')}</td>
                        </tr>
                        <tr>
                            <td><code>requestUpdate()</code></td>
                            <td>${msg('api.method.requestUpdate')}</td>
                        </tr>
                        <tr>
                            <td><code>emit(type, detail, options?)</code></td>
                            <td>${msg('api.method.emit')}</td>
                        </tr>
                        <tr>
                            <td><code>$(selector)</code></td>
                            <td>${msg('api.method.$')}</td>
                        </tr>
                        <tr>
                            <td><code>$$(selector)</code></td>
                            <td>${msg('api.method.$$')}</td>
                        </tr>
                        <tr>
                            <td><code>addController(ctrl)</code></td>
                            <td>${msg('api.method.addController')}</td>
                        </tr>
                        <tr>
                            <td><code>removeController(ctrl)</code></td>
                            <td>${msg('api.method.removeController')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h3>${msg('api.instanceProps')}</h3>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.type')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>updateComplete</code></td>
                            <td>Promise</td>
                            <td>${msg('api.prop.updateComplete')}</td>
                        </tr>
                        <tr>
                            <td><code>hasUpdated</code></td>
                            <td>Boolean</td>
                            <td>${msg('api.prop.hasUpdated')}</td>
                        </tr>
                        <tr>
                            <td><code>isUpdatePending</code></td>
                            <td>Boolean</td>
                            <td>${msg('api.prop.isUpdatePending')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('api.propertyConfig')}</h2>
            <lux-code
                language="javascript"
                .code=${`static properties = {
  // type + attribute sync
  label: { type: String, reflect: true },

  // Boolean attribute
  disabled: { type: Boolean, reflect: true },

  // Object/Array (JSON attribute)
  items: { type: Array, reflect: true },

  // No attribute sync (JS-only)
  value: { type: String, attribute: false },

  // Custom converter
  color: {
    type: String,
    converter: {
      toAttribute(v) { return v.toUpperCase(); },
      fromAttribute(v) { return v.toLowerCase(); },
    }
  },

  // hasChanged guard
  count: {
    type: Number,
    hasChanged: (newVal, oldVal) => newVal !== oldVal,
  },
}`}
                show-header
            ></lux-code>

            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.type')}</th>
                            <th>${msg('common.default')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>type</code></td>
                            <td>Constructor</td>
                            <td>—</td>
                            <td>${msg('api.opt.type')}</td>
                        </tr>
                        <tr>
                            <td><code>attribute</code></td>
                            <td>String / Boolean</td>
                            <td><code>true</code></td>
                            <td>${msg('api.opt.attribute')}</td>
                        </tr>
                        <tr>
                            <td><code>reflect</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('api.opt.reflect')}</td>
                        </tr>
                        <tr>
                            <td><code>converter</code></td>
                            <td>Object / Function</td>
                            <td>—</td>
                            <td>${msg('api.opt.converter')}</td>
                        </tr>
                        <tr>
                            <td><code>hasChanged</code></td>
                            <td>Function</td>
                            <td>—</td>
                            <td>${msg('api.opt.hasChanged')}</td>
                        </tr>
                        <tr>
                            <td><code>state</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('api.opt.state')}</td>
                        </tr>
                        <tr>
                            <td><code>noAccessor</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('api.opt.noAccessor')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('api.bindings')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>Syntax</th>
                            <th>${msg('common.type')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>\${value}</code></td>
                            <td>Text</td>
                            <td>${msg('api.binding.text')}</td>
                        </tr>
                        <tr>
                            <td><code>@click=\${fn}</code></td>
                            <td>Event</td>
                            <td>${msg('api.binding.event')}</td>
                        </tr>
                        <tr>
                            <td><code>.value=\${val}</code></td>
                            <td>Property</td>
                            <td>${msg('api.binding.prop')}</td>
                        </tr>
                        <tr>
                            <td><code>?hidden=\${bool}</code></td>
                            <td>Boolean</td>
                            <td>${msg('api.binding.bool')}</td>
                        </tr>
                        <tr>
                            <td><code>class=\${classMap({...})}</code></td>
                            <td>Class</td>
                            <td>${msg('api.binding.class')}</td>
                        </tr>
                        <tr>
                            <td><code>style=\${styleMap({...})}</code></td>
                            <td>Style</td>
                            <td>${msg('api.binding.style')}</td>
                        </tr>
                        <tr>
                            <td><code>ref=\${fn}</code></td>
                            <td>Ref</td>
                            <td>${msg('api.binding.ref')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('api.directives')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('api.directive')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>repeat(items, keyFn, renderFn)</code></td>
                            <td>${msg('api.directive.repeat')}</td>
                        </tr>
                        <tr>
                            <td><code>when(condition, trueFn, falseFn?)</code></td>
                            <td>${msg('api.directive.when')}</td>
                        </tr>
                        <tr>
                            <td><code>show(condition)</code></td>
                            <td>${msg('api.directive.show')}</td>
                        </tr>
                        <tr>
                            <td><code>nothing</code></td>
                            <td>${msg('api.directive.nothing')}</td>
                        </tr>
                        <tr>
                            <td><code>css\`...\`</code></td>
                            <td>${msg('api.directive.css')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('api.registerComponent')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { registerComponent } from '@ahriknow/lux';

// Register a custom element
registerComponent('my-element', MyElement);

// Now use in HTML
// <my-element></my-element>`}
                show-header
            ></lux-code>

            <h2>${msg('api.createComponent')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { createComponent, html } from '@ahriknow/lux';

const MyButton = createComponent(
  (self) => html\`<button @click=\${() => self.emit('tap')}>Click</button>\`,
  { properties: { label: { type: String } } }
);`}
                show-header
            ></lux-code>

            <div class="callout"><strong>Note:</strong> ${msg('api.note')}</div>
        `;
    }
}

export default PageApi;
