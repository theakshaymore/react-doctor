import { loadFont } from "@remotion/google-fonts/IBMPlexMono";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AFFECTED_FILE_COUNT,
  BACKGROUND_COLOR,
  BOX_BOTTOM,
  BOX_TOP,
  CHAR_FRAMES,
  COMMAND,
  CURSOR_BLINK_FRAMES,
  DIAGNOSTICS,
  ELAPSED_TIME,
  GREEN_COLOR,
  MUTED_COLOR,
  PERFECT_SCORE,
  RED_COLOR,
  SCENE_CTA_DURATION,
  SCENE_CTA_START,
  SCENE_DIAGNOSTICS_DURATION,
  SCENE_DIAGNOSTICS_START,
  SCENE_HERO_DURATION,
  SCENE_HERO_START,
  SCENE_SCORE_DURATION,
  SCENE_SCORE_START,
  SCENE_TYPING_DURATION,
  SCENE_TYPING_START,
  SCORE_BAR_WIDTH,
  TARGET_SCORE,
  TEXT_COLOR,
  TOTAL_ERROR_COUNT,
} from "../constants";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const baseStyle: React.CSSProperties = {
  fontFamily,
  color: TEXT_COLOR,
  fontSize: 32,
  lineHeight: 1.6,
};

const getScoreColor = (score: number) => {
  if (score >= 75) return GREEN_COLOR;
  if (score >= 50) return "#eab308";
  return RED_COLOR;
};

const getScoreLabel = (score: number) => {
  if (score >= 75) return "Great";
  if (score >= 50) return "Needs work";
  return "Critical";
};

const getDoctorFace = (score: number): [string, string] => {
  if (score >= 75) return ["◠ ◠", " ▽ "];
  if (score >= 50) return ["• •", " ─ "];
  return ["x x", " ▽ "];
};

const HeroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const subtitleSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 10,
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        ...baseStyle,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 72,
            fontWeight: 500,
            color: "white",
          }}
        >
          react-doctor
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            color: MUTED_COLOR,
            fontSize: 28,
          }}
        >
          Let coding agents diagnose and fix your React code.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TypingScene = () => {
  const frame = useCurrentFrame();

  const typedCharCount = Math.min(
    COMMAND.length,
    Math.floor(frame / CHAR_FRAMES),
  );
  const typedCommand = COMMAND.slice(0, typedCharCount);
  const isTypingDone = typedCharCount >= COMMAND.length;

  const cursorOpacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        ...baseStyle,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div>
        <span style={{ color: MUTED_COLOR }}>$ </span>
        <span style={{ color: "white" }}>{typedCommand}</span>
        <span style={{ opacity: cursorOpacity }}>▋</span>
      </div>

      {isTypingDone && (
        <div style={{ marginTop: 32 }}>
          <div style={{ color: "white" }}>react-doctor</div>
          <div style={{ color: MUTED_COLOR }}>
            Let coding agents diagnose and fix your React code.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const DiagnosticsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerDiagnostic = Math.floor(
    (SCENE_DIAGNOSTICS_DURATION - 15) / DIAGNOSTICS.length,
  );

  return (
    <AbsoluteFill
      style={{
        ...baseStyle,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        padding: 120,
      }}
    >
      <div style={{ color: MUTED_COLOR, marginBottom: 8 }}>
        $ {COMMAND}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "white" }}>react-doctor</div>
        <div style={{ color: MUTED_COLOR, marginBottom: 16 }}>
          Let coding agents diagnose and fix your React code.
        </div>
      </div>

      {DIAGNOSTICS.map((diagnostic, index) => {
        const diagnosticFrame = index * framesPerDiagnostic;
        const diagnosticSpring = spring({
          frame: frame - diagnosticFrame,
          fps,
          config: { damping: 200 },
        });

        const diagnosticOpacity = interpolate(diagnosticSpring, [0, 1], [0, 1]);
        const diagnosticY = interpolate(diagnosticSpring, [0, 1], [10, 0]);

        return (
          <div
            key={diagnostic.message}
            style={{
              opacity: diagnosticOpacity,
              transform: `translateY(${diagnosticY}px)`,
              marginBottom: 4,
              fontSize: 26,
            }}
          >
            <span style={{ color: RED_COLOR }}> ✗</span>
            {` ${diagnostic.message} `}
            <span style={{ color: MUTED_COLOR }}>({diagnostic.count})</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ScoreScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scoreProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const currentScore = Math.round(scoreProgress * TARGET_SCORE);
  const scoreColor = getScoreColor(currentScore);
  const [eyes, mouth] = getDoctorFace(currentScore);

  const doctorSpring = spring({ frame, fps, config: { damping: 200 } });
  const doctorOpacity = interpolate(doctorSpring, [0, 1], [0, 1]);
  const doctorScale = interpolate(doctorSpring, [0, 1], [0.95, 1]);

  const summarySpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 40,
  });
  const summaryOpacity = interpolate(summarySpring, [0, 1], [0, 1]);

  const filledCount = Math.round((currentScore / PERFECT_SCORE) * SCORE_BAR_WIDTH);
  const emptyCount = SCORE_BAR_WIDTH - filledCount;

  return (
    <AbsoluteFill
      style={{
        ...baseStyle,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: doctorOpacity,
            transform: `scale(${doctorScale})`,
          }}
        >
          <pre
            style={{
              color: scoreColor,
              lineHeight: 1.2,
              fontSize: 40,
              textAlign: "center",
            }}
          >
            {`  ${BOX_TOP}\n  │ ${eyes} │\n  │ ${mouth} │\n  ${BOX_BOTTOM}`}
          </pre>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>
            <span style={{ color: scoreColor, fontWeight: 500 }}>
              {currentScore}
            </span>
            <span style={{ color: MUTED_COLOR }}>
              {` / ${PERFECT_SCORE}  `}
            </span>
            <span style={{ color: scoreColor }}>{getScoreLabel(currentScore)}</span>
          </div>

          <div style={{ fontSize: 28, marginTop: 8, letterSpacing: 1 }}>
            <span style={{ color: scoreColor }}>
              {"█".repeat(filledCount)}
            </span>
            <span style={{ color: "#525252" }}>
              {"░".repeat(emptyCount)}
            </span>
          </div>
        </div>

        <div style={{ opacity: summaryOpacity, fontSize: 28, marginTop: 8 }}>
          <span style={{ color: RED_COLOR }}>{TOTAL_ERROR_COUNT} errors</span>
          <span style={{ color: MUTED_COLOR }}>
            {`  across ${AFFECTED_FILE_COUNT} files  in ${ELAPSED_TIME}`}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const commandSpring = spring({ frame, fps, config: { damping: 200 } });
  const commandOpacity = interpolate(commandSpring, [0, 1], [0, 1]);
  const commandY = interpolate(commandSpring, [0, 1], [20, 0]);

  const labelSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    delay: 8,
  });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        ...baseStyle,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div style={{ opacity: labelOpacity, color: MUTED_COLOR, fontSize: 28 }}>
          Try it on your codebase
        </div>
        <div
          style={{
            opacity: commandOpacity,
            transform: `translateY(${commandY}px)`,
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "12px 24px",
            fontSize: 36,
            color: "white",
          }}
        >
          {COMMAND}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Main = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BACKGROUND_COLOR }}>
      <Sequence
        from={SCENE_HERO_START}
        durationInFrames={SCENE_HERO_DURATION}
        premountFor={10}
      >
        <HeroScene />
      </Sequence>
      <Sequence
        from={SCENE_TYPING_START}
        durationInFrames={SCENE_TYPING_DURATION}
        premountFor={10}
      >
        <TypingScene />
      </Sequence>
      <Sequence
        from={SCENE_DIAGNOSTICS_START}
        durationInFrames={SCENE_DIAGNOSTICS_DURATION}
        premountFor={10}
      >
        <DiagnosticsScene />
      </Sequence>
      <Sequence
        from={SCENE_SCORE_START}
        durationInFrames={SCENE_SCORE_DURATION}
        premountFor={10}
      >
        <ScoreScene />
      </Sequence>
      <Sequence
        from={SCENE_CTA_START}
        durationInFrames={SCENE_CTA_DURATION}
        premountFor={10}
      >
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
