interface OwlSpeechBubbleProps {
  children: string;
}

export function OwlSpeechBubble({ children }: OwlSpeechBubbleProps) {
  return (
    <div className="owl-speech" role="status">
      {children.split('\n').map((line, i) =>
        line ? (
          <p key={i} style={{ margin: i === 0 ? 0 : '0.55rem 0 0' }}>
            {line}
          </p>
        ) : (
          <br key={i} />
        ),
      )}
    </div>
  );
}
