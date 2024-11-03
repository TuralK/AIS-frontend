import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../ui/button";
import { Textarea } from "../ui/text_area";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert_dialog";

function AnnouncementList({ announcements = [], updateAnnouncement }) {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState(null)
  const [newContent, setNewContent] = useState('')
  const [deleteMessage, setDeleteMessage] = useState('')
  const [updateMessage, setUpdateMessage] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedForDelete, setSelectedForDelete] = useState(null)
  const textareaRef = useRef(null)

  const handleUpdateClick = (id, currentContent) => {
    setEditingId(id)
    setNewContent(currentContent)
  }

  const handleUpdateSubmit = () => {
    if (newContent.trim() !== '') {
      updateAnnouncement(editingId, newContent)
      setEditingId(null)
      setNewContent('')
      setUpdateMessage(t('announcement_updated'))
      setTimeout(() => setUpdateMessage(''), 3000)
    }
  }

  const handleDelete = (id) => {
    setDeleteMessage(t('announcement_deleted'))
    setDeleteDialogOpen(false)
    setSelectedForDelete(null)
    setTimeout(() => setDeleteMessage(''), 3000)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [newContent])

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
      <div className="flex items-center justify-center">
        <h3 className="text-2xl font-semibold tracking-tight text-center">
          {t('announcements')}
        </h3>
      </div>

      <AnimatePresence>
        {(deleteMessage || updateMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {deleteMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteMessage}</AlertDescription>
              </Alert>
            )}
            {updateMessage && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{updateMessage}</AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="min-h-[200px] overflow-hidden">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  {editingId === announcement.id ? (
                    <div className="flex h-full flex-col space-y-4">
                      <Textarea
                        ref={textareaRef}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder={t('enter_new_content')}
                        style={{ overflow: 'auto', resize: "none" }}
                        className="text-sm leading-relaxed"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleUpdateSubmit}
                          className="flex-1 text-white bg-[#990000] hover:bg-[#500000]"
                          variant="default"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {t('submit')}
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t('cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4 text-sm leading-relaxed">
                        {announcement.content}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#990000] text-[#990000] hover:bg-[#990000] hover:text-white"
                          onClick={() => handleUpdateClick(announcement.id, announcement.content)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('update')}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-[#990000] text-white hover:bg-[#500000]"
                          onClick={() => {
                            setSelectedForDelete(announcement.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-white " />
                          {t('delete')}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm_deletion')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_announcement_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-500 hover:bg-gray-300">
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(selectedForDelete)}
              className="bg-[#990000] text-white hover:bg-[#500000]"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AnnouncementList