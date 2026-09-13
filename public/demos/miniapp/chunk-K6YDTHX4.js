import{d as e}from"./chunk-4CLCTAJ7.js";var r=(function(t){return t.Uri="uri",t.Base64="base64",t.DataUrl="dataUrl",t})(r||{}),o=(function(t){return t.Prompt="PROMPT",t.Camera="CAMERA",t.Photos="PHOTOS",t})(o||{}),a=(function(t){return t.Rear="REAR",t.Front="FRONT",t})(a||{});function s(){return btoa(unescape(encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <rect width="400" height="400" fill="#171b22"/>
    <path d="M200 120 L250 200 L200 280 L150 200 Z" fill="#00e5ff" opacity="0.85"/>
    <text x="200" y="330" fill="#98a2b0" font-family="sans-serif" font-size="20"
      text-anchor="middle">Foto de ejemplo</text>
  </svg>`)))}var i={requestPermissions(){return e(this,null,function*(){return{camera:"granted",photos:"granted"}})},checkPermissions(){return e(this,null,function*(){return{camera:"granted",photos:"granted"}})},getPhoto(t){return e(this,null,function*(){let n=s();return{base64String:n,dataUrl:`data:image/svg+xml;base64,${n}`,format:"svg"}})}};export{r as a,o as b,a as c,i as d};
