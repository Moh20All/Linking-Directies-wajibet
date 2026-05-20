"use client";

import React, { useEffect, useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  RefreshCw,
  MessageSquare,
  Send,
  PlusCircle,
  Paperclip,
  FileText,
  Download,
} from "lucide-react";

import {
  getCommunityPosts,
  createCommunityPost,
  addCommunityReply,
  updateCommunityPost,
  downloadFile,
} from "@/services/teacherService";
import { useLanguage } from "@/context/language-context";

// --- Type Definitions ---
interface Reply {
  _id: string;
  teacher?: { _id: string; full_name: string; email: string };
  student?: { _id: string; full_name: string; email: string; registeredGroupId?: string };
  content: string;
  createdAt: string;
  files?: { filename: string; path: string; mimetype: string }[];
}

interface Group {
  _id: string;
  groupName: string;
  groupId?: string;
  id?: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  teacher?: { _id: string; full_name: string; email: string };
  groups: Group[];
  replies: Reply[];
  createdAt: string;
  files?: { filename: string; path: string }[];
}

interface TeacherCommunityProps {
  getFreshToken: () => Promise<string | null>;
  teacherInfo: any;
}

// --- Helper Function ---
const formatRelativeTime = (dateString: string) =>
  formatDistanceToNow(new Date(dateString), { addSuffix: true });

// --- Create Post Form Component ---
const CreatePostForm = ({
  teacherInfo,
  getFreshToken,
  onPostCreated,
}: {
  teacherInfo: any;
  getFreshToken: TeacherCommunityProps["getFreshToken"];
  onPostCreated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, isRTL } = useLanguage()

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsCreating(true);

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication error");

      await createCommunityPost(token, {
        title,
        content,
        groups: selectedGroups,
        files,
      });

      onPostCreated();

      setTitle("");
      setContent("");
      setSelectedGroups([]);
      setFiles([]);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-6 h-4 mr-2" />
          {t.BTN_CREATE_POST}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t.DIALOG_CREATE_TITLE}</DialogTitle>
          <DialogDescription>
            {t.DIALOG_CREATE_DESC}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder={t.INPUT_POST_TITLE}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder={t.INPUT_POST_CONTENT}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div>
            <Label className="font-semibold">{t.LABEL_VISIBLE_GROUPS}</Label>
            <div className="grid grid-cols-2 gap-2 p-2 border rounded-md mt-2 max-h-32 overflow-y-auto">
              {[
                ...new Set(
                  teacherInfo?.currentGroups?.map((g: any) => g.groupId)
                ),
              ].map((groupId) => {
                const group = teacherInfo.currentGroups.find(
                  (g: any) => g.groupId === groupId
                );
                if (!group) return null;
                return (
                  <div key={groupId as string} className="flex items-center gap-2">
                    <Checkbox
                      id={groupId as string}
                      checked={selectedGroups.includes(groupId as string)}
                      onCheckedChange={() => handleGroupToggle(groupId as string)}
                    />
                    <Label
                      htmlFor={groupId as string}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {(groupId as string).split("-")[1] +
                        "-" +
                        (groupId as string).split("-")[2] +
                        "-" +
                        (groupId as string).split("-")[3]}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File attachment */}
          <div>
            <Label htmlFor="file-upload" className="font-semibold">
              Attach Files
            </Label>
            <div className="mt-2">
              <Label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Paperclip className="w-6 h-6 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-semibold">{t.UPLOAD_CLICK}</span>
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </Label>
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-1 rounded text-sm"
                  >
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreatePost}
            disabled={isCreating || !title.trim() || !content.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.BTN_POSTING}
              </>
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Post Card Component ---
const PostCard = ({
  post,
  onReplyAdded,
  onPostUpdated,
  getFreshToken,
  teacherInfo,
}: {
  post: Post;
  onReplyAdded: (postId: string, reply: Reply) => void;
  onPostUpdated: () => void;
  getFreshToken: TeacherCommunityProps["getFreshToken"];
  teacherInfo: any;
}) => {
  const [newReply, setNewReply] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState<{
    title: string;
    content: string;
    groups?: string[];
  }>({
    title: post.title,
    content: post.content,
    groups: post.groups?.map(g => g.groupId || g.id || "")
  });
  const [saving, setSaving] = useState(false);
  const { t, isRTL } = useLanguage()

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    setLoadingReply(true);
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication error");
      const reply = await addCommunityReply(token, post._id, newReply);
      onReplyAdded(post._id, reply);
      setNewReply("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReply(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication error");
      await updateCommunityPost(token, post._id, editPost);
      onPostUpdated();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isAuthor =
    (post.teacher && post.teacher._id === teacherInfo._id) ||
    (!post.teacher && teacherInfo.role === "HEADMASTER"); 
    
  const isHeadmasterPost = !post.teacher;

  return (
    <Card className={`w-full transition-shadow hover:shadow-lg ${isHeadmasterPost ? "border-purple-500 border-2 bg-purple-50/10" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className={isHeadmasterPost ? "bg-purple-600 text-white" : ""}>
                {post.teacher
                  ? post.teacher.full_name.charAt(0).toUpperCase()
                  : "H"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                {isHeadmasterPost && (
                    <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
                    {t.studentcomm_badge_headmaster || "Headmaster"}
                    </Badge>
                )}
              </div>
              <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                <p>
                  By{" "}
                  {isAuthor
                    ? "You"
                    : post.teacher
                    ? post.teacher.full_name
                    : "Headmaster"}
                </p>
                <span>•</span>
                <p
                  title={
                    post.createdAt.split("T")[0] +
                    " " +
                    post.createdAt.split("T")[1].split(".")[0]
                  }
                >
                  {formatRelativeTime(post.createdAt)}
                </p>
                {post.groups?.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      {post.groups.map((g) => (
                        <Badge key={g._id} variant="default">
                          {g.groupName}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {isAuthor && (
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {t.POST_EDIT}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t.POST_EDIT_TITLE}</DialogTitle>
                  <DialogDescription>
                    {t.POST_EDIT_DESC}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="edit-title" className="font-semibold">
                      {t.POST_EDIT_FIELD_TITLE}
                    </Label>
                    <Input
                      id="edit-title"
                      value={editPost.title}
                      onChange={(e) =>
                        setEditPost((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Post Title"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="edit-content" className="font-semibold">
                      {t.POST_EDIT_FIELD_CONTENT}
                    </Label>
                    <Textarea
                      id="edit-content"
                      value={editPost.content}
                      onChange={(e) =>
                        setEditPost((p) => ({ ...p, content: e.target.value }))
                      }
                      placeholder="What's on your mind?"
                      rows={5}
                    />
                  </div>

                  {/* Groups */}
                  <div>
                    <Label className="font-semibold">{t.POST_EDIT_VISIBLE_GROUPS}</Label>
                    <div className="grid grid-cols-2 gap-2 p-2 border rounded-md mt-2 max-h-32 overflow-y-auto">
                      {[
                        ...new Set(
                          teacherInfo?.currentGroups?.map(
                            (g: any) => g.groupId
                          )
                        ),
                      ].map((groupId, idx) => {
                        const group = teacherInfo.currentGroups.find(
                          (g: any) => g.groupId === groupId
                        );
                        if (!group) return null;

                        const gId = groupId as string;

                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <Checkbox
                              id={gId}
                              checked={editPost.groups?.includes(gId)}
                              onCheckedChange={() =>
                                setEditPost((p) => ({
                                  ...p,
                                  groups: p.groups?.includes(gId)
                                    ? p.groups.filter((id) => id !== gId)
                                    : [...(p.groups || []), gId],
                                }))
                              }
                            />
                            <Label
                              htmlFor={gId}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {group.groupId}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                    >
                      {t.POST_EDIT_CANCEL}
                    </Button>
                    <Button onClick={handleSaveEdit} disabled={saving}>
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        t.POST_EDIT_SAVE
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.groups?.length > 0 && (
          <div className="flex gap-2 items-center text-xs text-gray-500">
            <span>{t.POST_SELECTED_GROUPS} : </span>
            <div className="flex flex-wrap gap-2">
              {post.groups.map((g) => (
                <Badge key={g._id} variant="secondary">
                  {g.groupName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {post.files && post.files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">{t.POST_ATTACHMENTS}</h4>
            <div className="flex flex-col gap-2">
              {post.files.map((file, index) => {
                const fileName = file.filename;
                return (
                  <button
                    key={index}
                    title="click to download"
                    onClick={() => downloadFile(file.path)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-muted p-2 rounded-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{fileName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {post.replies?.length > 0 && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="replies">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4" />
                  {t.POST_VIEW_REPLIES} {post.replies.length} {t.POST_VIEW_REPLIES_COUNT}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {post.replies.map((reply) => {
                    const isHeadmasterReply = !reply.student && !reply.teacher;
                    const isReplyAuthor =
                        (post.teacher &&
                        reply.teacher?._id === post.teacher._id) ||
                        (!post.teacher && isHeadmasterReply);
                    
                    return (
                  <div
                    key={reply._id}
                    className={`flex items-start gap-3 px-3 py-4 border rounded-xl shadow-md ${
                        isHeadmasterReply
                          ? "border-purple-500 bg-purple-50/10"
                          : "border-gray-200"
                      }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`text-xs ${
                            isHeadmasterReply ? "bg-purple-600 text-white" : ""
                          }`}>
                        {reply.student?.full_name?.charAt(0).toUpperCase() ||
                          reply.teacher?.full_name?.charAt(0).toUpperCase() ||
                          "H"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div
                        className={`text-sm flex items-center gap-2 ${
                          reply.student?._id === teacherInfo._id ||
                          reply.teacher?._id === teacherInfo._id
                            ? "font-extrabold"
                            : " font-semibold"
                        }`}
                      >
                        {reply.student?.full_name ||
                          reply.teacher?.full_name ||
                          (isHeadmasterReply
                              ? t.studentcomm_badge_headmaster || "Headmaster"
                              : "Unknown")}{" "}
                        {(reply.student?._id === teacherInfo._id ||
                          reply.teacher?._id === teacherInfo._id) && (
                          <>
                            <Badge variant={"default"}>{t.POST_REPLY_YOU}</Badge>
                          </>
                        )}
                        {reply?.teacher && (
                          <Badge variant={"destructive"}>{t.POST_REPLY_TEACHER}</Badge>
                        )}
                        {reply?.student && (
                          <Badge variant={"secondary"}>{t.POST_REPLY_STUDENT}</Badge>
                        )}
                        {reply?.student?.registeredGroupId && (
                             <Badge variant="outline">{reply.student.registeredGroupId.split("-")[2]}</Badge>
                        )}
                        
                         {isHeadmasterReply && (
                            <Badge
                              variant="default"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {t.studentcomm_badge_headmaster || "Headmaster"}
                            </Badge>
                          )}
                          
                        {isReplyAuthor && (
                          <Badge variant={"outline"}>{t.studentcomm_reply_author || "Author"}</Badge>
                        )}
                        
                        <span className="text-gray-600">•</span>
                        <p className="text-xs font-normal text-gray-400">
                          {formatRelativeTime(reply.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">{reply.content}</p>
                        {reply.files && reply.files.length > 0 && (
                          <div className="flex flex-col gap-1 mt-1">
                            {reply.files.map((f, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline text-xs"
                                onClick={() => {
                                  let path = f.path;
                                  if (path) {
                                    // Fix path for Windows/Unix compatibility if needed, though usually standard handled by backend
                                    path = path.startsWith("/") ? path.slice(1) : path;
                                    downloadFile(path);
                                  }
                                }}
                              >
                                <Paperclip className="w-3 h-3" />
                                <span>{f.filename}</span>
                                <Download className="w-3 h-3 ml-1" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )})}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      <CardFooter>
        <form
          onSubmit={handleReplySubmit}
          className="flex w-full items-center gap-2"
        >
          <Input
            placeholder={t.POST_REPLY_PLACEHOLDER}
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            disabled={loadingReply}
          />
          <Button type="submit" size="icon" disabled={!newReply.trim()}>
            {loadingReply ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

// --- Skeleton Loading Component ---
const PostSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-1/3" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </CardContent>
  </Card>
);

// --- Main Community Component ---
const TeacherCommunity = ({
  getFreshToken,
  teacherInfo,
}: TeacherCommunityProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const { t, isRTL } = useLanguage()
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication error");
      const data = await getCommunityPosts(token);
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReplyAdded = (postId: string, reply: Reply) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, replies: [...p.replies, reply] } : p
      )
    );
    if (teacherInfo) {
      fetchPosts();
    }
  };

  useEffect(() => {
    if (teacherInfo) {
      fetchPosts();
    }
  }, [teacherInfo]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;
    if (filter === "mine") {
      filtered = filtered.filter((p) => {
        if (!p.teacher) return teacherInfo?.role === "HEADMASTER";
        return p.teacher.email === teacherInfo?.email;
      });
    }
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [posts, filter, sortOrder, teacherInfo]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 bg-red-50 p-6 rounded-lg">
          <p className="font-semibold mb-2">⚠ {t.FEED_ERROR_TITLE}</p>
          <p className="text-sm mb-4">{error}</p>
          <Button variant="destructive" onClick={fetchPosts}>
            <RefreshCw className="w-4 h-4 mr-2" /> {t.FEED_TRY_AGAIN}
          </Button>
        </div>
      );
    }

    if (filteredAndSortedPosts.length === 0) {
      return (
        <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
          <h3 className="text-lg font-semibold">{t.FEED_NO_POSTS_TITLE}</h3>
          <p>{t.FEED_NO_POSTS_DESC}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredAndSortedPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onReplyAdded={handleReplyAdded}
            onPostUpdated={fetchPosts}
            getFreshToken={getFreshToken}
            teacherInfo={teacherInfo}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.FEED_TITLE}</h1>
          <p className="text-muted-foreground">
            {t.FEED_DESC}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button variant={"default"} onClick={() => fetchPosts()}>
            <RefreshCw />
            {t.FEED_REFRESH}
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            {t.FEED_BTN_ALL}
          </Button>
          <Button
            variant={filter === "mine" ? "default" : "outline"}
            onClick={() => setFilter("mine")}
          >
            {t.FEED_BTN_MINE}
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
          >
            {sortOrder === "newest" ? "Sort: Newest" : "Sort: Oldest"}
          </Button>

          <CreatePostForm
            teacherInfo={teacherInfo}
            getFreshToken={getFreshToken}
            onPostCreated={fetchPosts}
          />
        </div>
      </header>

      <main>{renderContent()}</main>
    </div>
  );
};

export default TeacherCommunity;
