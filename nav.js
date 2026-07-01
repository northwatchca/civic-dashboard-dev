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
        <a class="site-nav-brand" href="${r}index.html">Northwatch</a>
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
    .site-nav-inner{
      max-width:1100px;margin:0 auto;padding:0 24px;
      display:flex;align-items:center;justify-content:space-between;
      height:52px;
    }
    .site-nav-brand{
      font-size:15px;font-weight:700;letter-spacing:0.02em;
      color:#111110;text-decoration:none;text-transform:uppercase;
      letter-spacing:0.08em;
    }
    .site-nav-brand:hover{color:#c82d29;}
    .site-nav-links{display:flex;align-items:center;gap:28px;}
    .site-nav-links a{
      font-size:12.5px;color:#706c66;text-decoration:none;
      text-transform:uppercase;letter-spacing:0.06em;font-weight:500;
      transition:color .15s;
    }
    .site-nav-links a:hover,.site-nav-links a.active{color:#c82d29;}
    .site-nav-links a.active{font-weight:600;}
    @media(max-width:640px){
      .site-nav-links{gap:14px;}
      .site-nav-links a{font-size:11px;}
      .site-nav-brand{font-size:13px;}
    }
  `;

  document.head.appendChild(style);
  document.body.insertAdjacentHTML('afterbegin', navHTML);
})();
