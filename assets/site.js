(function(){
  var h=document.querySelector('header.site');
  function onScroll(){h&&h.classList.toggle('scrolled',window.scrollY>10)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var burger=document.querySelector('.burger'),menu=document.querySelector('.menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var o=menu.classList.toggle('open');
      burger.setAttribute('aria-expanded',o);
      document.body.style.overflow=o?'hidden':'';
    });
    menu.querySelectorAll('.has-dd>button').forEach(function(b){
      b.addEventListener('click',function(){
        if(window.innerWidth<=1080){b.parentNode.classList.toggle('open')}
      });
    });
  }

  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e)});
  } else els.forEach(function(e){e.classList.add('in')});

  document.querySelectorAll('form.devis').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var msg=f.querySelector('.form-msg'),btn=f.querySelector('button[type=submit]');
      msg.className='form-msg';
      if(/github\.io$|localhost|127\.0\.0\.1/.test(location.hostname)){
        msg.textContent="Aperçu : le formulaire sera actif une fois le site en ligne sur at-company.fr.";
        msg.className='form-msg ok';return;
      }
      btn.disabled=true;
      fetch(f.getAttribute('action'),{method:'POST',body:new FormData(f)})
        .then(function(r){return r.json()})
        .then(function(d){
          if(d&&d.ok){f.reset();msg.textContent="Merci ! Votre demande est bien partie. Un expert AT Company vous rappelle très vite.";msg.className='form-msg ok'}
          else{msg.textContent=(d&&d.error)||"Oups, l'envoi n'a pas fonctionné. Appelez-nous au 01 47 90 75 60.";msg.className='form-msg err'}
        })
        .catch(function(){msg.textContent="Oups, l'envoi n'a pas fonctionné. Appelez-nous au 01 47 90 75 60.";msg.className='form-msg err'})
        .then(function(){btn.disabled=false});
    });
  });
})();
