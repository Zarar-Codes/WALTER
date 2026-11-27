import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { SERVICE_AREAS } from '../data/siteData';

export function ServiceAreasSection() {
  const [selectedId, setSelectedId] = useState<string>(SERVICE_AREAS[0].id);
  const activeArea =
    SERVICE_AREAS.find((a) => a.id === selectedId) ?? SERVICE_AREAS[0];

  return (
    <section
      id="service-areas"
      aria-labelledby="service-areas-heading"
      className="bg-[#ECEFED] py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading, Copy & Verified Location Selector */}
          <div className="lg:col-span-6 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#008F24]"
            >
              Where We Work
            </motion.p>

            <motion.h2
              id="service-areas-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[#192647] tracking-[-0.03em] leading-[1.02] text-[clamp(2.1rem,4.1vw,3.85rem)]"
            >
              BRINGING BEAUTIFUL
              <br />
              LANDSCAPES TO THE{' '}
              <span className="font-editorial italic font-medium text-[#008F24] tracking-normal">
                GTA.
              </span>
            </motion.h2>

            <p className="text-base sm:text-lg text-[#242824]/80 leading-relaxed max-w-xl">
              Based in Stouffville, Walter&apos;s Landscaping works with
              residential and commercial properties throughout Toronto and the
              Greater Toronto Area and surrounding communities.
            </p>

            {/* Verified Location Directory */}
            <div className="pt-2">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#747B76] mb-3">
                Select a Community to Explore
              </p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.map((area) => {
                  const isActive = area.id === activeArea.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedId(area.id)}
                      className={`px-4 py-2.5 text-sm font-display font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#192647] text-white'
                          : 'bg-white text-[#192647] hover:bg-[#192647]/10 border border-[#D4DCD4]'
                      }`}
                    >
                      {area.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Area Detail Box */}
            <div className="bg-white border border-[#D4DCD4] p-6 sm:p-7">
              <div className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#008F24] mb-1.5">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{activeArea.role}</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#192647] mb-2">
                {activeArea.name}
              </h3>
              <p className="text-sm sm:text-base text-[#242824]/78 leading-relaxed">
                {activeArea.description}
              </p>
            </div>
          </div>

          {/* Right Column: Minimalist Architectural GTA Location Diagram (Zero External Map APIs) */}
          <div className="lg:col-span-6">
            <div className="bg-[#192647] p-6 sm:p-8 border border-[#121D39] text-white">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/12">
                <span className="text-xs font-semibold tracking-[0.16em] uppercase text-white/75">
                  Greater Toronto Area &amp; York Region
                </span>
                <span className="text-xs tracking-[0.12em] uppercase text-[#00C52B]">
                  Ontario, Canada
                </span>
              </div>

              <svg
                viewBox="0 0 600 440"
                role="img"
                aria-label="Architectural map diagram of Walter's Landscaping service areas across Stouffville, Newmarket, Aurora, Richmond Hill, Markham, North York, and Toronto"
                className="w-full h-auto block"
              >
                {/* Architectural Grid Lines */}
                <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
                  {[80, 160, 240, 320, 400, 480, 560].map((x) => (
                    <line key={`vx-${x}`} x1={x} y1={0} x2={x} y2={440} />
                  ))}
                  {[70, 140, 210, 280, 350].map((y) => (
                    <line key={`hy-${y}`} x1={0} y1={y} x2={600} y2={y} />
                  ))}
                </g>

                {/* Lake Ontario Shoreline Abstract Architectural Contour */}
                <path
                  d="M 40 422 Q 180 398 310 385 T 575 348 L 600 440 L 0 440 Z"
                  fill="#121D39"
                  stroke="#00C52B"
                  strokeOpacity="0.28"
                  strokeWidth="1.2"
                />
                <text
                  x="430"
                  y="412"
                  fill="#A8B3A4"
                  fillOpacity="0.65"
                  fontSize="11"
                  letterSpacing="3"
                  fontFamily="DM Sans, sans-serif"
                >
                  LAKE ONTARIO
                </text>

                {/* Regional Corridor Lines Connecting Stouffville HQ & Tree Farm to GTA */}
                <g stroke="#00C52B" strokeOpacity="0.32" strokeWidth="1.5" strokeDasharray="4 4">
                  <line x1={418} y1={168} x2={296} y2={66} />
                  <line x1={418} y1={168} x2={288} y2={132} />
                  <line x1={418} y1={168} x2={274} y2={214} />
                  <line x1={418} y1={168} x2={374} y2={244} />
                  <line x1={374} y1={244} x2={262} y2={292} />
                  <line x1={274} y1={214} x2={262} y2={292} />
                  <line x1={262} y1={292} x2={254} y2={368} />
                </g>

                {/* Interactive Community Markers */}
                {SERVICE_AREAS.map((node) => {
                  const isActive = node.id === activeArea.id;
                  const labelOffsetX =
                    node.id === 'stouffville' || node.id === 'markham' ? 16 : -16;
                  const textAnchor =
                    node.id === 'stouffville' || node.id === 'markham'
                      ? 'start'
                      : 'end';

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedId(node.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedId(node.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select ${node.name} — ${node.role}`}
                      className="cursor-pointer outline-none"
                    >
                      {/* Outer Selection Ring */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isActive ? 17 : node.isPrimary ? 12 : 9}
                        fill={isActive ? '#00C52B' : '#24345F'}
                        fillOpacity={isActive ? 0.24 : 0.65}
                        stroke={isActive ? '#00C52B' : '#A8B3A4'}
                        strokeWidth={isActive ? 2 : 1}
                      />

                      {/* Core Marker Dot */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isActive ? 6 : node.isPrimary ? 5 : 4}
                        fill={isActive || node.isPrimary ? '#00C52B' : '#FFFFFF'}
                      />

                      {/* Location Typography */}
                      <text
                        x={node.x + labelOffsetX}
                        y={node.y + 4}
                        textAnchor={textAnchor}
                        fill={isActive ? '#00C52B' : '#FFFFFF'}
                        fontSize={isActive || node.isPrimary ? '14' : '12.5'}
                        fontWeight={isActive || node.isPrimary ? '700' : '500'}
                        fontFamily="Space Grotesk, sans-serif"
                      >
                        {node.name}
                      </text>
                      {node.isPrimary && (
                        <text
                          x={node.x + labelOffsetX}
                          y={node.y + 18}
                          textAnchor={textAnchor}
                          fill="#A8B3A4"
                          fontSize="9.5"
                          letterSpacing="1.2"
                          fontFamily="DM Sans, sans-serif"
                        >
                          {node.id === 'stouffville'
                            ? 'HEADQUARTERS'
                            : node.id === 'newmarket'
                            ? 'TREE FARM'
                            : 'GTA CORE'}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="mt-4 pt-4 border-t border-white/12 flex flex-wrap items-center justify-between gap-2 text-xs text-white/65">
                <span>Residential &amp; Commercial Properties</span>
                <span>Toronto · York Region · Surrounding Communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
