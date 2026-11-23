/**
 * Hai phối cảnh đồ họa cho cùng một khu phố.
 * Không chứa logic tương tác; vị trí nhân vật vẫn do WORLD_INTERACTABLES điều khiển.
 */
export function NeighborhoodMapArt() {
  return (
    <>
      <svg className="world-art world-art--landscape" viewBox="0 0 1200 720" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
        <defs>
          <pattern id="land-brick" width="48" height="24" patternUnits="userSpaceOnUse">
            <rect width="48" height="24" fill="#b96f4e"/><path d="M0 0H48M0 12H48M24 0V12M0 12V24" stroke="#8c513d" strokeWidth="2"/>
          </pattern>
          <pattern id="land-tile" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="#c9b995"/><path d="M0 0H32V32H0Z" fill="none" stroke="#9b8768" strokeWidth="2"/><path d="M16 0V16H32M0 16H16V32" fill="none" stroke="#e2d2ae" strokeWidth="2"/>
          </pattern>
          <pattern id="land-road" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" fill="#4f5d60"/><path d="M8 10h8v3H8zM42 42h5v3h-5zM26 25h3v3h-3zM0 63H64" fill="#687779" stroke="#687779" strokeWidth="1"/>
          </pattern>
          <pattern id="land-awning" width="24" height="20" patternUnits="userSpaceOnUse">
            <rect width="24" height="20" fill="#f2d89a"/><rect width="12" height="20" fill="#b95343"/>
          </pattern>
        </defs>
        <rect width="1200" height="720" fill="#819d83"/>
        <rect y="0" width="1200" height="235" fill="url(#land-brick)"/>
        <rect y="0" width="1200" height="18" fill="#704738"/>
        <path d="M0 26L1200 60M0 60L1200 26M0 92L1200 92" stroke="#322f2c" strokeWidth="3" opacity=".55"/>
        <path d="M15 42L220 80L410 34L650 75L890 34L1180 78M40 100L330 54L585 105L850 54L1150 105" fill="none" stroke="#292f30" strokeWidth="3"/>
        <g fill="#f5d98c" stroke="#6d4633" strokeWidth="5">
          <rect x="42" y="65" width="240" height="116" fill="#e7c58d"/><rect x="300" y="65" width="240" height="116" fill="#e7d1a4"/>
          <rect x="558" y="65" width="240" height="116" fill="#dfbd87"/><rect x="816" y="65" width="342" height="116" fill="#e8c891"/>
        </g>
        <g fill="#8bb8ad" stroke="#694936" strokeWidth="5">
          <rect x="72" y="91" width="80" height="74"/><rect x="334" y="91" width="80" height="74"/><rect x="592" y="91" width="80" height="74"/><rect x="856" y="91" width="92" height="74"/>
        </g>
        <g fill="#dce9d8"><rect x="80" y="99" width="64" height="54"/><rect x="342" y="99" width="64" height="54"/><rect x="600" y="99" width="64" height="54"/><rect x="864" y="99" width="76" height="54"/></g>
        <g stroke="#533c30" strokeWidth="5" fill="none"><path d="M42 181H282M300 181H540M558 181H798M816 181H1158"/><path d="M55 55H270M314 55H527M572 55H785M830 55H1144"/></g>
        <g fill="#455e54" stroke="#513b2f" strokeWidth="4">
          <rect x="180" y="102" width="54" height="48"/><rect x="440" y="102" width="54" height="48"/><rect x="700" y="102" width="54" height="48"/><rect x="1010" y="102" width="76" height="48"/>
        </g>
        <g stroke="#513b2f" strokeWidth="3"><path d="M180 113H234M190 102V150M204 102V150M218 102V150M440 113H494M450 102V150M464 102V150M478 102V150M700 113H754M710 102V150M724 102V150M738 102V150"/></g>
        <g fill="#b9d7d0" stroke="#6b4934" strokeWidth="4"><rect x="12" y="140" width="30" height="38"/><rect x="1155" y="138" width="32" height="40"/></g>
        <g fill="#f2d078" stroke="#573b2b" strokeWidth="4">
          <rect x="28" y="190" width="260" height="43"/><rect x="294" y="190" width="260" height="43"/><rect x="560" y="190" width="260" height="43"/><rect x="826" y="190" width="346" height="43"/>
        </g>
        <g fill="#fff0cf" fontFamily="monospace" fontWeight="bold" fontSize="20" textAnchor="middle">
          <text x="158" y="218">TẠP HÓA</text><text x="424" y="218">ĂN VẶT</text><text x="690" y="218">NƯỚC GIẢI KHÁT</text><text x="999" y="218">SẠP CHỢ</text>
        </g>
        <g fill="#d4a06f" stroke="#614431" strokeWidth="4">
          <rect x="16" y="120" width="44" height="38"/><rect x="1140" y="115" width="44" height="40"/>
          <rect x="1040" y="34" width="90" height="40" rx="3"/>
        </g>
        <g stroke="#49372d" strokeWidth="3"><path d="M0 235H1200M0 244H1200" /></g>
        <g>
          <rect y="238" width="1200" height="180" fill="url(#land-tile)"/>
          <path d="M0 238H1200M0 414H1200" stroke="#705b43" strokeWidth="12"/>
          <path d="M0 252H1200M0 402H1200" stroke="#f0dfbd" strokeWidth="4"/>
          <path d="M0 290H1200M0 355H1200" stroke="#aa987a" strokeWidth="3" opacity=".5"/>
        </g>
        <g shapeRendering="crispEdges">
          <rect x="12" y="278" width="16" height="122" fill="#876746"/><circle cx="20" cy="270" r="48" fill="#4e8054" stroke="#315b42" strokeWidth="7"/><circle cx="0" cy="254" r="24" fill="#69975f"/><circle cx="44" cy="246" r="25" fill="#67945a"/>
          <rect x="1110" y="272" width="16" height="128" fill="#876746"/><circle cx="1118" cy="255" r="52" fill="#4e8054" stroke="#315b42" strokeWidth="7"/><circle cx="1092" cy="237" r="23" fill="#69975f"/><circle cx="1148" cy="226" r="25" fill="#67945a"/>
          <rect x="84" y="346" width="50" height="44" fill="#96734d" stroke="#553d2d" strokeWidth="5"/><rect x="92" y="320" width="34" height="28" fill="#c8b58e" stroke="#553d2d" strokeWidth="4"/>
          <rect x="1000" y="340" width="54" height="50" fill="#96734d" stroke="#553d2d" strokeWidth="5"/><rect x="1007" y="311" width="40" height="30" fill="#c8b58e" stroke="#553d2d" strokeWidth="4"/>
        </g>
        <g transform="translate(285 350)" shapeRendering="crispEdges">
          <rect x="-96" y="-70" width="192" height="18" fill="url(#land-awning)" stroke="#5b3a2a" strokeWidth="5"/>
          <rect x="-88" y="-52" width="176" height="115" fill="#a54d37" stroke="#593c2d" strokeWidth="7"/>
          <rect x="-80" y="-26" width="160" height="75" fill="#e8d7b2" stroke="#6b4a35" strokeWidth="5"/>
          <rect x="-71" y="-18" width="66" height="61" fill="#8ab5a9"/><rect x="3" y="-18" width="68" height="61" fill="#eac276"/>
          <rect x="-34" y="-12" width="8" height="55" fill="#66472f"/>
          <rect x="-88" y="-90" width="176" height="30" fill="#f0c65e" stroke="#5a3d2d" strokeWidth="5"/>
          <text x="0" y="-70" fill="#fff1cf" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="17">BÁNH TRÁNG</text>
          <rect x="-72" y="-45" width="144" height="12" fill="#f5e7c6"/>
          <g fill="#ba5a3c"><circle cx="-48" cy="-38" r="5"/><circle cx="-25" cy="-38" r="5"/><circle cx="0" cy="-38" r="5"/><circle cx="25" cy="-38" r="5"/><circle cx="48" cy="-38" r="5"/></g>
          <g fill="#e6c27a" stroke="#5b3e2b" strokeWidth="3"><rect x="-65" y="-8" width="25" height="10"/><rect x="-28" y="-8" width="25" height="10"/><rect x="9" y="-8" width="25" height="10"/><rect x="44" y="-8" width="20" height="10"/></g>
          <g fill="#d5ad70"><circle cx="-66" cy="75" r="17" stroke="#5a4430" strokeWidth="6"/><circle cx="66" cy="75" r="17" stroke="#5a4430" strokeWidth="6"/></g>
          <g fill="#f5d889"><rect x="-55" y="54" width="28" height="10"/><rect x="-20" y="54" width="28" height="10"/><rect x="15" y="54" width="28" height="10"/></g>
          <path d="M-4 -98C-20 -118 8 -126 -4 -144M10 -98C24 -118 0 -127 16 -148" stroke="#d9d2c4" strokeWidth="5" fill="none" className="world-smoke"/>
          <path d="M-10 55Q0 42 10 55L7 66H-7Z" fill="#e8753e" className="world-flame"/>
        </g>
        <g transform="translate(888 350)" shapeRendering="crispEdges">
          <path d="M-100 -64L0 -126L100 -64Z" fill="#b64f40" stroke="#634231" strokeWidth="8"/>
          <rect x="-86" y="-64" width="172" height="126" fill="#d8a35e" stroke="#694a35" strokeWidth="7"/>
          <rect x="-60" y="-28" width="120" height="86" fill="#a9c8bc" stroke="#684833" strokeWidth="6"/>
          <text x="0" y="-38" textAnchor="middle" fill="#fff0cf" fontFamily="monospace" fontSize="16" fontWeight="bold">QUÁN NƯỚC</text>
          <rect x="-82" y="62" width="164" height="10" fill="#6a4d38"/>
          <rect x="-52" y="-116" width="104" height="12" fill="#f4d37e"/>
        </g>
        <g transform="translate(700 385)" fill="#d2b27b" stroke="#654732" strokeWidth="5"><rect x="-36" y="-18" width="72" height="18"/><path d="M-28 0V18M28 0V18"/></g>
        <g transform="translate(790 395)" fill="#bf5543" stroke="#5c3c2c" strokeWidth="4"><path d="M-22 0H22V22H-22Z"/><path d="M-18 -9H18V0H-18Z" fill="#f1d18b"/></g>
        <g transform="translate(570 260)" fill="#64845b" stroke="#493c2c" strokeWidth="3"><rect x="-18" y="0" width="36" height="32"/><path d="M-14 0L0 -18L14 0Z" fill="#e1bd76"/></g>
        <g>
          <rect y="422" width="1200" height="298" fill="url(#land-road)"/>
          <path d="M0 422H1200M0 710H1200" stroke="#d9c9a7" strokeWidth="12"/>
          <path d="M0 566H1200" stroke="#f0dfa8" strokeWidth="5" strokeDasharray="50 36"/>
          <path d="M602 422V710" stroke="#f2e4b9" strokeWidth="4" strokeDasharray="20 18" opacity=".6"/>
          <g fill="#718082" opacity=".6"><rect x="40" y="470" width="8" height="4"/><rect x="190" y="620" width="9" height="4"/><rect x="360" y="500" width="7" height="4"/><rect x="890" y="640" width="8" height="4"/><rect x="1080" y="480" width="7" height="4"/></g>
        </g>
        <g transform="translate(175 455)" shapeRendering="crispEdges">
          <rect x="-35" y="6" width="70" height="22" rx="4" fill="#2c82b5" stroke="#203f56" strokeWidth="5"/><path d="M-22 6L-9 -12H18L30 6Z" fill="#d6e9e3" stroke="#203f56" strokeWidth="4"/><circle cx="-20" cy="30" r="10" fill="#242a2e" stroke="#c8b48d" strokeWidth="4"/><circle cx="22" cy="30" r="10" fill="#242a2e" stroke="#c8b48d" strokeWidth="4"/>
        </g>
        <g transform="translate(1015 465)" shapeRendering="crispEdges">
          <path d="M-36 16L-20 -8H22L38 16V27H-36Z" fill="#c99c4e" stroke="#594432" strokeWidth="4"/><rect x="-14" y="-4" width="26" height="15" fill="#b8d4d1" stroke="#594432" strokeWidth="3"/><circle cx="-20" cy="28" r="8" fill="#262b2c"/><circle cx="23" cy="28" r="8" fill="#262b2c"/>
        </g>
        <g fill="#f3d58a" fontFamily="monospace" fontWeight="bold" fontSize="17"><text x="32" y="700">KHU PHỐ BÁN BÁNH TRÁNG · SÀI GÒN</text></g>
      </svg>

      <svg className="world-art world-art--portrait" viewBox="0 0 720 1200" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
        <defs>
          <pattern id="port-brick" width="42" height="22" patternUnits="userSpaceOnUse"><rect width="42" height="22" fill="#b96f4e"/><path d="M0 0H42M0 11H42M21 0V11M0 11V22" stroke="#8c513d" strokeWidth="2"/></pattern>
          <pattern id="port-tile" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#c9b995"/><path d="M0 0H30V30H0Z" fill="none" stroke="#9b8768" strokeWidth="2"/><path d="M15 0V15H30M0 15H15V30" fill="none" stroke="#e2d2ae" strokeWidth="2"/></pattern>
          <pattern id="port-road" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#4f5d60"/><path d="M8 9h8v4H8zM42 42h6v4h-6zM0 59H60" fill="#687779" stroke="#687779" strokeWidth="1"/></pattern>
          <pattern id="port-awning" width="20" height="18" patternUnits="userSpaceOnUse"><rect width="20" height="18" fill="#f2d89a"/><rect width="10" height="18" fill="#b95343"/></pattern>
        </defs>
        <rect width="720" height="1200" fill="#819d83"/>
        <rect y="0" width="720" height="435" fill="url(#port-brick)"/>
        <rect y="0" width="720" height="22" fill="#704738"/>
        <path d="M0 38L720 88M0 98L720 36M0 150L720 102" stroke="#292f30" strokeWidth="3" opacity=".7"/>
        <path d="M12 76L180 44L350 95L520 44L708 86M0 130L210 88L420 145L720 95" fill="none" stroke="#292f30" strokeWidth="3"/>
        <g stroke="#543c32" strokeWidth="7">
          <rect x="14" y="164" width="164" height="220" fill="#e7c58d"/><rect x="188" y="164" width="164" height="220" fill="#e7d1a4"/>
          <rect x="362" y="164" width="164" height="220" fill="#dfbd87"/><rect x="536" y="164" width="170" height="220" fill="#e8c891"/>
        </g>
        <g fill="#9bc2b5" stroke="#654632" strokeWidth="5">
          <rect x="38" y="202" width="58" height="106"/><rect x="212" y="202" width="58" height="106"/><rect x="386" y="202" width="58" height="106"/><rect x="560" y="202" width="60" height="106"/>
        </g>
        <g fill="#e1eee0"><rect x="45" y="210" width="44" height="90"/><rect x="219" y="210" width="44" height="90"/><rect x="393" y="210" width="44" height="90"/><rect x="567" y="210" width="46" height="90"/></g>
        <g stroke="#634632" strokeWidth="5"><path d="M115 190V378M289 190V378M463 190V378M637 190V378"/><path d="M20 320H170M194 320H344M368 320H518M542 320H700"/></g>
        <g fill="#f2d078" stroke="#573b2b" strokeWidth="4">
          <rect x="14" y="352" width="164" height="58"/><rect x="188" y="352" width="164" height="58"/><rect x="362" y="352" width="164" height="58"/><rect x="536" y="352" width="170" height="58"/>
        </g>
        <g fill="#fff0cf" fontFamily="monospace" fontWeight="bold" fontSize="17" textAnchor="middle">
          <text x="96" y="388">TẠP HÓA</text><text x="270" y="388">ĂN VẶT</text><text x="444" y="388">NƯỚC GIẢI KHÁT</text><text x="620" y="388">SẠP CHỢ</text>
        </g>
        <g stroke="#563c2e" strokeWidth="4" fill="#a9c6b7">
          <rect x="24" y="248" width="22" height="22"/><rect x="675" y="248" width="22" height="22"/>
          <path d="M25 110H102V136H25ZM620 110H697V136H620Z"/>
        </g>
        <g fill="#f4d37e" stroke="#684832" strokeWidth="4"><path d="M52 22H78V92H52Z"/><path d="M642 22H668V92H642Z"/></g>
        <g fill="#e8aa54" stroke="#65432e" strokeWidth="4"><path d="M80 22V52M90 32V62M620 22V52M630 32V62"/></g>
        <rect y="430" width="720" height="390" fill="url(#port-tile)"/>
        <path d="M0 438H720M0 810H720" stroke="#705b43" strokeWidth="13"/>
        <path d="M0 452H720M0 796H720" stroke="#f0dfbd" strokeWidth="4"/>
        <path d="M0 510H720M0 725H720" stroke="#aa987a" strokeWidth="3" opacity=".5"/>
        <g shapeRendering="crispEdges">
          <rect x="23" y="590" width="14" height="158" fill="#876746"/><circle cx="30" cy="575" r="58" fill="#4e8054" stroke="#315b42" strokeWidth="7"/><circle cx="0" cy="555" r="27" fill="#69975f"/><circle cx="65" cy="550" r="27" fill="#67945a"/>
          <rect x="678" y="586" width="14" height="160" fill="#876746"/><circle cx="684" cy="565" r="58" fill="#4e8054" stroke="#315b42" strokeWidth="7"/><circle cx="650" cy="540" r="25" fill="#69975f"/><circle cx="710" cy="532" r="28" fill="#67945a"/>
          <rect x="82" y="710" width="46" height="34" fill="#96734d" stroke="#553d2d" strokeWidth="5"/><rect x="90" y="687" width="30" height="24" fill="#c8b58e" stroke="#553d2d" strokeWidth="4"/>
        </g>
        <g transform="translate(173 700)" shapeRendering="crispEdges">
          <rect x="-112" y="-66" width="224" height="20" fill="url(#port-awning)" stroke="#5b3a2a" strokeWidth="5"/>
          <rect x="-104" y="-46" width="208" height="130" fill="#a54d37" stroke="#593c2d" strokeWidth="8"/>
          <rect x="-92" y="-18" width="184" height="88" fill="#e8d7b2" stroke="#6b4a35" strokeWidth="6"/>
          <rect x="-80" y="-8" width="72" height="72" fill="#8ab5a9"/><rect x="8" y="-8" width="72" height="72" fill="#eac276"/>
          <path d="M0 -8V64" stroke="#66472f" strokeWidth="7"/>
          <rect x="-104" y="-88" width="208" height="34" fill="#f0c65e" stroke="#5a3d2d" strokeWidth="5"/>
          <text x="0" y="-65" fill="#fff1cf" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="18">BÁNH TRÁNG</text>
          <g fill="#d16d45"><circle cx="-55" cy="-35" r="6"/><circle cx="-28" cy="-35" r="6"/><circle cx="0" cy="-35" r="6"/><circle cx="28" cy="-35" r="6"/><circle cx="55" cy="-35" r="6"/></g>
          <g fill="#f4d889"><rect x="-78" y="-12" width="22" height="10"/><rect x="-48" y="-12" width="22" height="10"/><rect x="-18" y="-12" width="22" height="10"/><rect x="12" y="-12" width="22" height="10"/><rect x="42" y="-12" width="22" height="10"/></g>
          <circle cx="-72" cy="96" r="18" fill="#343a3d" stroke="#d2b58a" strokeWidth="6"/><circle cx="72" cy="96" r="18" fill="#343a3d" stroke="#d2b58a" strokeWidth="6"/>
          <path d="M-14 -98C-28 -120 7 -128 -7 -151M8 -100C22 -119 -5 -133 14 -154" stroke="#d9d2c4" strokeWidth="6" fill="none" className="world-smoke"/>
          <path d="M-12 72Q0 53 12 72L7 85H-7Z" fill="#e8753e" className="world-flame"/>
        </g>
        <g transform="translate(535 695)" shapeRendering="crispEdges">
          <path d="M-92 -78L0 -136L92 -78Z" fill="#b64f40" stroke="#634231" strokeWidth="8"/>
          <rect x="-80" y="-78" width="160" height="138" fill="#d8a35e" stroke="#694a35" strokeWidth="7"/>
          <rect x="-56" y="-37" width="112" height="94" fill="#a9c8bc" stroke="#684833" strokeWidth="6"/>
          <text x="0" y="-45" textAnchor="middle" fill="#fff0cf" fontFamily="monospace" fontSize="15" fontWeight="bold">QUÁN NƯỚC</text>
          <rect x="-72" y="-8" width="16" height="68" fill="#c18a4c"/><rect x="56" y="-8" width="16" height="68" fill="#c18a4c"/>
        </g>
        <g transform="translate(126 775)" fill="#d2b27b" stroke="#654732" strokeWidth="5"><rect x="-34" y="-15" width="68" height="17"/><path d="M-26 2V18M26 2V18"/></g>
        <g transform="translate(620 778)" fill="#bf5543" stroke="#5c3c2c" strokeWidth="4"><path d="M-23 0H23V23H-23Z"/><path d="M-18 -9H18V0H-18Z" fill="#f1d18b"/></g>
        <rect y="830" width="720" height="370" fill="url(#port-road)"/>
        <path d="M0 830H720M0 1190H720" stroke="#d9c9a7" strokeWidth="13"/>
        <path d="M0 1010H720" stroke="#f0dfa8" strokeWidth="5" strokeDasharray="52 38"/>
        <path d="M360 830V1190" stroke="#f2e4b9" strokeWidth="4" strokeDasharray="18 18" opacity=".65"/>
        <g fill="#718082" opacity=".65"><rect x="52" y="880" width="9" height="4"/><rect x="232" y="1124" width="10" height="4"/><rect x="488" y="900" width="8" height="4"/><rect x="632" y="1080" width="9" height="4"/></g>
        <g fill="#f3d58a" fontFamily="monospace" fontWeight="bold" fontSize="14"><text x="24" y="1175">HẺM NHỎ · SÀI GÒN</text></g>
      </svg>
    </>
  );
}
