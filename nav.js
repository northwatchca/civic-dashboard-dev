(function(){
  const path = window.location.pathname;
  const inData = path.includes('/data/');
  const r = inData ? '../' : '';

  const links = [
    { href: r + 'index.html',            label: 'Home' },
    { href: r + 'data/index.html',       label: 'Data' },
    { href: r + 'timeline.html',         label: 'Timeline' },
    { href: r + 'thesis.html',           label: 'Thesis' },
    { href: r + 'methodology.html',      label: 'Methodology' },
    { href: r + 'changelog.html',        label: 'Changelog' },
    { href: r + 'index.html#about',      label: 'About' },
    { href: r + 'index.html#take-action',label: 'Take Action' },
  ];

  // Active link detection
  const cur = path.split('/').pop() || 'index.html';
  function isActive(href){
    const h = href.split('/').pop().split('#')[0] || 'index.html';
    return h === cur;
  }

  const navHTML = `
    <nav class="site-nav" id="site-nav">
      <div class="site-nav-inner">
        <a class="site-nav-brand" href="${r}index.html" id="site-nav-brand">
          <span id="site-nav-brand-word">NORTHWATCH</span><span class="site-nav-brand-leaf" id="site-nav-brand-leaf"><svg viewBox="315.5 95 127.8 279" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M201 232l-13.3 4.4 61.4 54c4.7 13.7-1.6 17.8-5.6 25l66.6-8.4-1.6 67 13.9-.3-3.1-66.6 66.7 8c-4.1-8.7-7.8-13.3-4-27.2l61.3-51-10.7-4c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4q-3.2 1.3-5.2-2.2l-23-46-23.6 47.8q-2.8 2.5-5 .7L264 130.8l13.7 74.1c-1.1 3-3.7 3.8-6.7 2.2l-31.2-35.3c-4 6.5-6.8 17.1-12.2 19.5s-23.5-4.5-35.6-7c4.2 14.8 17 39.6 9 47.7Z"/></svg><span class="site-nav-brand-star" id="site-nav-brand-star"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 1 L14.3 9.4 L23 12 L14.3 14.6 L12 23 L9.7 14.6 L1 12 L9.7 9.4 Z"/></svg></span></span>
        </a>
        <div class="site-nav-links">
          ${links.map(l=>`<a href="${l.href}"${isActive(l.href)?' class="active"':''}>${l.label}</a>`).join('')}
        </div>
      </div>
    </nav>`;

  const style = document.createElement('style');
  style.textContent = `
    .site-nav{
      background:#fff;
      border-bottom:1px solid #e2dfd8;
      position:sticky;top:0;z-index:500;
    }
    #site-nav-root{ height:auto !important; }
    .site-nav-inner{
      max-width:1100px;margin:0 auto;padding:0 24px;
      display:flex;align-items:center;justify-content:space-between;
      height:52px;
    }
    .site-nav-brand{
      font-family:'Source Serif 4',serif;
      font-size:22.5px;font-weight:700;letter-spacing:0.02em;
      color:#111110;text-decoration:none;text-transform:none;
      flex-shrink:0;
      padding:18px 0;display:inline-flex;align-items:flex-start;
    }
    .site-nav-brand:hover #site-nav-brand-word{color:#c11f1f;}
    #site-nav-brand-leaf{
      display:inline-block;height:1.111em;width:auto;
      color:#c11f1f;margin-left:0.1333em;position:relative;
    }
    #site-nav-brand-leaf > svg{display:block;height:100%;width:auto;}
    #site-nav-brand-star{
      position:absolute;top:1%;left:59%;width:44%;height:21.5%;
      color:#c11f1f;
    }
    #site-nav-brand-star svg{display:block;width:100%;height:100%;}
    .site-nav-links{
      display:flex;align-items:center;gap:18px;
      overflow-x:auto;-webkit-overflow-scrolling:touch;
      scrollbar-width:none;-ms-overflow-style:none;
      min-width:0;margin-left:20px;
    }
    .site-nav-links::-webkit-scrollbar{display:none;}
    .site-nav-links a{
      font-size:12.5px;color:#706c66;text-decoration:none;
      text-transform:uppercase;letter-spacing:0.06em;font-weight:500;
      transition:color .15s;flex-shrink:0;
      padding:18px 6px;display:inline-block;
    }
    .site-nav-links a:hover,.site-nav-links a.active{color:#c11f1f;}
    .site-nav-links a.active{font-weight:600;}
    @media(max-width:640px){
      .site-nav-links{gap:16px;margin-left:16px;}
      .site-nav-links a{font-size:11px;}
      .site-nav-brand{font-size:19.5px;}
    }
  `;

  document.head.appendChild(style);
  const root = document.getElementById('site-nav-root');
  if (root) {
    root.outerHTML = navHTML;
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  // Leaf sizing/gap is pure CSS (em-based, see #site-nav-brand-leaf) —
  // no JS measurement, so it can't drift on resize. See Session 19 handoff.
})();
