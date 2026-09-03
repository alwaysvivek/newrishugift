interface CharacterProps {
  variant: 'boy' | 'girl';
  className?: string;
  style?: React.CSSProperties;
  'data-speed'?: string;
}

export default function Character({
  variant,
  className = '',
  style,
  'data-speed': dataSpeed,
}: CharacterProps) {
  return (
    <div
      className={`character ${variant} ${className}`}
      style={style}
      data-speed={dataSpeed}
    >
      <div className="hair" />
      <div className="head">
        <i className="eye l" />
        <i className="eye r" />
        <div className="mouth" />
      </div>
      <div className="body" />
      <div className="arm l" />
      <div className="arm r" />
      <div className="leg l" />
      <div className="leg r" />
      <div className="shoe l" />
      <div className="shoe r" />
    </div>
  );
}
