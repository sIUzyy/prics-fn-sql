export default function LoadingSpinner() {
  return (
    <div
      className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full"
      role="status"
      aria-label="loading"
    ></div>
  );
}
