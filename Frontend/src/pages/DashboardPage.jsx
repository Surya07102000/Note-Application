import { useState, useEffect } from "react";
import { Plus, Search, Sparkles, FileText as FileIcon } from "lucide-react";
import { useNoteStore } from "../store/noteStore";
import { NoteCard } from "../components/notes/NoteCard";
import { NoteModal } from "../components/notes/NoteModal";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ShareModal } from "../components/notes/ShareModal";

export function DashboardPage() {
    const {
        notes, isLoading, fetchNotes, searchNotes, createNote,
        deleteNote, updateNote, shareNote, removeSharing,
        archiveNote, unarchiveNote
    } = useNoteStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        fetchNotes(1, false); // Always show only active (non-archived) notes
    }, [fetchNotes]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim()) {
            searchNotes(e.target.value, false); // Only search active notes
        } else {
            fetchNotes(1, false);
        }
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
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10 md:space-y-12 animate-fade-in font-inter" style={{ color: 'var(--foreground)' }}>
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8 pt-20 lg:pt-4">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit tracking-tight leading-tight">Welcome back!</h1>
                    <p className="text-muted-foreground text-base sm:text-lg md:text-xl font-medium max-w-xl">
                        Your intelligent workspace is ready. What will you create today?
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    <Button
                        onClick={openCreateModal}
                        className="flex-1 md:flex-none py-6 px-8 rounded-2xl text-lg font-bold gap-3 shadow-2xl shadow-primary/30"
                    >
                        <Plus className="w-6 h-6" />
                        New Entry
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => alert("AI Assistant is analyzing your workspace...")}
                        className="flex-1 md:flex-none py-6 px-8 rounded-2xl text-lg font-bold gap-3 bg-gradient-to-r from-indigo-500 to-primary border-none shadow-2xl shadow-indigo-500/20"
                    >
                        <Sparkles className="w-6 h-6" />
                        AI Power
                    </Button>
                </div>
            </header>

            {/* Search Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all" />
                <div className="relative flex flex-col md:flex-row gap-4 items-center backdrop-blur-xl p-3 rounded-[2rem] border shadow-2xl" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
                        <input
                            type="text"
                            placeholder="Search in title, content or tags..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full bg-transparent pl-16 pr-6 py-4 outline-none font-bold text-lg"
                            style={{ color: 'var(--foreground)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-72 rounded-[2rem] animate-pulse border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {notes.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {notes.map((note) => (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                    <NoteCard
                                        note={note}
                                        onEdit={() => openEditModal(note)}
                                        onDelete={() => deleteNote(note.id)}
                                        onShare={() => openShareModal(note)}
                                        onArchive={archiveNote}
                                        onUnarchive={unarchiveNote}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-32 text-center bg-card/20 rounded-[3rem] border border-dashed"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-inner" style={{ background: 'var(--secondary)' }}>
                                <FileIcon className="w-12 h-12 text-muted-foreground/20" />
                            </div>
                            <h3 className="text-3xl font-bold font-outfit" style={{ color: 'var(--foreground)' }}>Your thought vault is empty</h3>
                            <Button
                                onClick={openCreateModal}
                                className="mt-10 py-6 px-10 rounded-2xl text-lg font-bold gap-3"
                                variant="outline"
                            >
                                <Plus className="w-6 h-6" />
                                Create Your First Note
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
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
