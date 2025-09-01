
import { ProjectsClient } from './projects-client';
import { getAllProjects } from './actions';
import { type Project } from './schema';

export default async function ProjectsPage() {
  const projects: Project[] = await getAllProjects();

  return <ProjectsClient initialProjects={projects} />;
}
