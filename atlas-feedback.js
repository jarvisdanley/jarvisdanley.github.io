/* Atlas place feedback: every 👍/👎 tap is also sent to Atlas so it can learn Jeff's taste.
   Wraps each page's existing vote(); the local highlight behaviour is unchanged. */
(function () {
  var TOPIC = 'atlas-fb-c53462a8207b2ea0';
  function send(id, btn) {
    try {
      var st = JSON.parse(localStorage.getItem('atlas_vote_' + id) || '{}');
      var card = btn && btn.closest ? (btn.closest('.rec-card') || btn.closest('.card') || btn.closest('li')) : null;
      var nameEl = card && card.querySelector('.name, h3, h4, strong');
      var payload = JSON.stringify({
        trip: location.pathname.split('/').filter(Boolean)[0] || 'landing',
        id: id, v: st.voted || 'cleared',
        name: nameEl ? nameEl.textContent.trim().slice(0, 80) : id,
        ts: new Date().toISOString()
      });
      fetch('https://ntfy.sh/' + TOPIC, { method: 'POST', body: payload, keepalive: true, mode: 'cors' })
        .catch(function () { if (navigator.sendBeacon) navigator.sendBeacon('https://ntfy.sh/' + TOPIC, payload); });
    } catch (e) {}
  }
  function wrap() {
    if (typeof window.vote !== 'function' || window.vote.__atlas) return;
    var orig = window.vote;
    var w = function (id, dir, btn) { var r = orig.apply(this, arguments); send(id, btn); return r; };
    w.__atlas = true; window.vote = w;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wrap); else wrap();
})();
