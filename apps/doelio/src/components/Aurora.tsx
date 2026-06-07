/**
 * The luminous "wallpaper" the Liquid Glass sits on. Fixed behind everything and
 * fully static (pure CSS radial gradients, no blur filter, no animation) so it
 * never forces the glass above it to re-sample its backdrop per frame.
 */
export default function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__grain" />
    </div>
  );
}
