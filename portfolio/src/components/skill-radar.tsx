"use client";

import { motion } from "framer-motion";

interface SkillRadarProps {
  skills: { name: string; level: number }[];
  size?: number;
}

export function SkillRadar({ skills, size = 300 }: SkillRadarProps) {
  if (skills.length < 3) return null;

  const center = size / 2;
  const maxRadius = size / 2 - 45;
  const count = skills.length;
  const rings = [25, 50, 75, 100];

  // Calculate polygon points for the skill data
  const dataPoints = skills.map((skill, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const r = (skill.level / 100) * maxRadius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  // Labels positioned outside the chart
  const labels = skills.map((skill, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    const labelR = maxRadius + 28;
    return {
      x: center + labelR * Math.cos(angle),
      y: center + labelR * Math.sin(angle),
      name: skill.name,
      level: skill.level,
      anchor: (
        Math.abs(Math.cos(angle)) < 0.1
          ? "middle"
          : Math.cos(angle) > 0
          ? "start"
          : "end"
      ) as "middle" | "start" | "end",
    };
  });

  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="max-w-full h-auto"
        role="img"
        aria-label={`Radar chart showing skill levels: ${skills.map((s) => `${s.name} at ${s.level}%`).join(", ")}`}
      >
        {/* Background rings */}
        {rings.map((ring) => {
          const r = (ring / 100) * maxRadius;
          const ringPoints = Array.from({ length: count }, (_, i) => {
            const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(" ");
          return (
            <polygon
              key={ring}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-border"
            />
          );
        })}

        {/* Axis lines */}
        {skills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-border"
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="oklch(0.596 0.17 155.2 / 0.2)"
          stroke="oklch(0.596 0.17 155.2)"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill="oklch(0.596 0.17 155.2)"
            stroke="var(--background)"
            strokeWidth={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={label.y}
            textAnchor={label.anchor}
            dominantBaseline="central"
            className="fill-muted-foreground text-[10px]"
          >
            {label.name}
          </text>
        ))}
      </svg>
    </div>
  );
}
