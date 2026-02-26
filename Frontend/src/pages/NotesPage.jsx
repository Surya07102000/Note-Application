import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { useNoteStore } from "../store/noteStore";
import { NoteCard } from "../components/notes/NoteCard";
import { NoteModal } from "../components/notes/NoteModal";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ShareModal } from "../components/notes/ShareModal";

export function NotesPage({ defaultShowArchived = false }) {
    const {
        notes, isLoading, fetchNotes, createNote, updateNote,
        deleteNote, shareNote, removeSharing, archiveNote, unarchiveNote
    } = useNoteStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showArchived, setShowArchived] = useState(defaultShowArchived);

    useEffect(() => {
        fetchNotes(1, showArchived);
    }, [fetchNotes, showArchived]);

    const toggleArchiveView = () => {
        setShowArchived(!showArchived);
    };

    const handleCreateNote = async (data) => {
        if (selectedNote) {
            await updateNote(selectedNote.id, data);
        } else {
            await createNote(data);
        }
    };

    const openCreateModal = () => {
        setSelectedNote(null);
        setIsModalOpen(true);
    };

    const openEditModal = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    const openShareModal = (note) => {
        setSelectedNote(note);
        setIsShareModalOpen(true);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-inter" style={{ color: 'var(--foreground)' }}>
            <header className="flex justify-between items-center pt-4">
                <div>
                    <h1 className="text-5xl font-black font-outfit tracking-tight">{showArchived ? "Archived Notes" : "My Notes"}</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        {showArchived ? "View and restore your archived thoughts." : "Manage and organize your personal thought repository."}
                    </p>
                </div>
                {!defaultShowArchived && (
                    <div className="flex gap-4">
                        <Button
                            onClick={toggleArchiveView}
                            variant="secondary"
                            className="gap-3 py-6 px-8 rounded-2xl font-bold text-lg"
                        >
                            {showArchived ? "Active Notes" : "Archive"}
                        </Button>
                        <Button onClick={openCreateModal} className="gap-3 py-6 px-8 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/20">
                            <Plus className="w-6 h-6" />
                            New Note
                        </Button>
                    </div>
                )}
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 rounded-[2rem] bg-white/[0.03] animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={() => openEditModal(note)}
                            onDelete={() => deleteNote(note.id)}
                            onShare={() => openShareModal(note)}
                            onArchive={archiveNote}
                            onUnarchive={unarchiveNote}
                        />
                    ))}
                </div>
            )}

            {!isLoading && notes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 bg-card/20 rounded-[3rem] border border-dashed" style={{ borderColor: 'var(--border)' }}>
                    <FileText className="w-20 h-20 text-muted-foreground/10 mb-6" />
                    <p className="text-muted-foreground text-xl font-medium">No notes available yet.</p>
                    <Button onClick={openCreateModal} variant="outline" className="mt-8 py-4 px-8 rounded-xl" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        Start Writing
                    </Button>
                </div>
            )}

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateNote}
                onDelete={deleteNote}
                onShare={openShareModal}
                note={selectedNote}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                noteId={selectedNote?.id}
                onShare={shareNote}
                onRemoveSharing={removeSharing}
            />
        </div>
    );
}
