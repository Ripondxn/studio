
'use client';

import { useState, useEffect } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { type Project } from './schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddProjectDialog } from './add-project-dialog';
import { getAllProjects } from './actions';

export function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const refreshData = async () => {
    const updatedData = await getAllProjects();
    setProjects(updatedData);
  };
  
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your active and completed projects.
          </p>
        </div>
        <Button onClick={() => { setSelectedProject(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      
      <DataTable columns={columns({ onEdit: handleEdit, onUpdate: refreshData })} data={projects} />
      <AddProjectDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        project={selectedProject}
        onSuccess={refreshData}
      />
    </div>
  );
}
