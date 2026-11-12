interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loader({
  fullScreen = false,
  size = 'md',
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      role="status"
      aria-label="Загрузка"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center p-4">{spinner}</div>;
}
