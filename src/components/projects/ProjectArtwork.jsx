export default function ProjectArtwork({ project, index, total }) {
  return (
    <div className="project-artwork" data-variant={project.variant} aria-hidden="true">
      <div className="project-artwork__top technical">
        <span>MA / SYSTEM {String(index + 1).padStart(2, "0")}</span>
        <span>{project.category}</span>
      </div>
      <div className="project-artwork__field">
        <span className="project-artwork__mark">{project.mark}</span>
        <i className="project-artwork__axis project-artwork__axis--x" />
        <i className="project-artwork__axis project-artwork__axis--y" />
        <i className="project-artwork__module project-artwork__module--one" />
        <i className="project-artwork__module project-artwork__module--two" />
        <i className="project-artwork__module project-artwork__module--three" />
      </div>
      <div className="project-artwork__bottom technical">
        <span>{project.visualLabel}</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
