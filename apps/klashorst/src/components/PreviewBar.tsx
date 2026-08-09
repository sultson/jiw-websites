/**
 * Shown only when the Worker served drafts. Somebody looking at a preview has
 * to be able to tell at a glance that this is not what the public sees, or they
 * will report a change as live that nobody has published yet.
 */
export default function PreviewBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-red bg-red px-4 py-2 text-center text-[0.72rem] uppercase tracking-[0.16em] text-white">
      Voorbeeld: concept, nog niet gepubliceerd
    </div>
  );
}
