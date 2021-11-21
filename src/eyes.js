import React from "react";

class Eyes extends React.Component {

    componentDidMount() {
        const leftListener  = this.eyeBinding('leftEye');
        const rightListener = this.eyeBinding('rightEye');
        document.onmousemove = evt => { // highlander pattern
            leftListener(evt);
            rightListener(evt);
        }
    }

    eyeView = id => {
    return <svg id="${id}" viewBox="0 0 120 120">

      <filter id="shadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset       dx="0" dy="8" />
        <feColorMatrix  type="matrix"
                        values="0 0 0 0  0
                                0 0 0 0  0
                                0 0 0 0  0
                                0 0 0 .5 0"/>
        <feBlend        in="SourceGraphic" mode="normal"/>
      </filter>

      <radialGradient id="gradient1" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
        <stop offset= "38%" stopColor="#000000" stopOpacity="1" />
        <stop offset= "46%" stopColor="#073F80" stopOpacity="1" />
        <stop offset= "90%" stopColor="#8EC0DD" stopOpacity="1" />
        <stop offset="100%" stopColor="#2F3A46" stopOpacity="1" />
      </radialGradient>
      <g id="${id}_iris">
        <ellipse cx="60" cy="60" rx="30" ry="30" opacity="1" fill="url(#gradient1)" />
        <ellipse cx="50" cy="50" rx="7"  ry="7"  opacity="1" fill="#FFFFFF" fillOpacity="0.8"/>
      </g>
      <g id="${id}_openLids">
        <path d="M0 60 A60,60 0 0,1 120,60 A60,30 0 0,0 0,60 Z" opacity="1" fill="#FDDC99" fillOpacity="1" filter="url(#shadow)" />
        <path d="M0 60 A60,60 0 0,0 120,60 A60,40 0 0,1 0,60 Z" opacity="1" fill="#F4CB76" fillOpacity="1" />
      </g>
      <g id="${id}_closeLid">
        <path d="M0 60 A60,60 0 0,1 120,60 A60,40 0 0,1 0,60 Z" opacity="1" fill="#FDDC99" fillOpacity="1" />
      </g>
    </svg>
    ;
}


     eyeBinding = eyeId => {
        const rect          = document.querySelectorAll(eyeId + "_iris ellipse")[0].getBoundingClientRect();
        const iris          = document.querySelector(eyeId + "_iris");
        const closeLidLayer = document.querySelector(eyeId + "_closeLid");
        closeLidLayer.style.opacity = 0;

        setInterval( evt => {
            if (closeLidLayer.style.opacity === '1') return; // do not close and then open if already closed
            closeLidLayer.style.opacity = '1';
            setTimeout(evt => closeLidLayer.style.opacity = '0', 300)
        }, 7 * 1000);

        const xo = rect.x + rect.width/2;  // x-origin
        const yo = rect.y + rect.height/2; // y-origin

        document.querySelector(eyeId).onclick = evt =>
            closeLidLayer.style.opacity = (closeLidLayer.style.opacity === '1') ? '0' : '1';

        return evt => {
            const xm = evt.clientX - xo; // the normalized x/y coords to work with
            const ym = evt.clientY - yo;

            const xmax = rect.width/1.5;
            const ymax = rect.height/2;

            const widestFocus = 400; // when x is so far away, the eye is maximal extended
            const scaledX = xm * (xmax / widestFocus );
            let   xe = xm > 0
                        ? Math.min( xmax, scaledX)
                        : Math.max(-xmax, scaledX);
            const scaledY = ym * (ymax / widestFocus );
            let   ye = ym > 0
                        ? Math.min( ymax, scaledY)
                        : Math.max(-ymax, scaledY);
            if (xe*xe + ye*ye > xmax * ymax) {
                xe *= 0.9;
                ye *= 0.9;
            }
            iris.style.transform = `translateX(${xe}px) translateY(${ye}px)`;
        }
    };

    render(){
        return (
        <div>
            {this.eyeView('leftEye')}
            {this.eyeView('rightEye')}
        </div>
        )
    }

} export default Eyes