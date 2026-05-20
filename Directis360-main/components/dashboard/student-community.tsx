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
import { Input } from "@/components/ui/input";
import {
  Loader2,
  RefreshCw,
  MessageSquare,
  Send,
  FileText,
  Paperclip,
  X,
  Filter,
} from "lucide-react";

import {
  getCommunityPostsStudents,
  addCommunityReplyStudent,
  downloadFile,
} from "@/services/teacherService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Teacher } from "@/services/staffPedagogyService";
import { useLanguage } from "@/context/language-context"

// --- Types ---
interface Reply {
  _id: string;
  teacher?: { _id: string; full_name: string };
  student?: { _id: string; full_name: string; email: string };
  content: string;
  createdAt: string;
  files?: { filename: string; path: string; mimetype: string }[];
}

interface Group {
  _id: string;
  groupName: string;
  id: string; // Matches CommunityGroup
  groupId?: string; // Optional for backward compatibility if needed
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
  canReply?: boolean; // NEW: whether the student can reply
}

interface StudentCommunityProps {
  studentInfo: any;
  getFreshToken: () => Promise<string | null>;
}

// --- Helpers ---
const formatRelativeTime = (dateString: string) =>
  formatDistanceToNow(new Date(dateString), { addSuffix: true });

// --- Post Card ---

const PostCard = ({
  post,
  onReplyAdded,
  getFreshToken,
  studentInfo,
}: {
  post: Post;
  onReplyAdded: (postId: string, reply: Reply) => void;
  getFreshToken: StudentCommunityProps["getFreshToken"];
  studentInfo: any;
}) => {
  const [newReply, setNewReply] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { t, isRTL } = useLanguage()
  // --- NEW: Ref for the file input ---
  // This allows us to programmatically clear the input value when the file is removed.
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || post.canReply === false) return;
    setLoadingReply(true);

    try {
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication error");

      // The service function already handles the file, no changes needed here.
      console.log("file to upload : ", file);
const reply = await addCommunityReplyStudent(
        token,
        post._id,
        newReply,
        file || undefined
      );
      onReplyAdded(post._id, reply);

      // Reset state after successful submission
      setNewReply("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      // Optional: Add a toast notification to inform the user of the error.
    } finally {
      setLoadingReply(false);
    }
  };

  // --- NEW: Handler to remove the selected file ---
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input's memory
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

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
              <div className="flex items-center flex-wrap gap-x-2 text-sm text-muted-foreground">
                <p>By {post.teacher ? post.teacher.full_name : "Headmaster"}</p>
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
                    <div className="flex items-center gap-1">
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
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

        {post.files && post.files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">{t.studentcomm_post_attachments}</h4>
            <div className="flex flex-col gap-2">
              {post.files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => downloadFile(file.path)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline bg-muted p-2 rounded-md w-fit"
                >
                  <FileText className="w-4 h-4" />
                  <span>{file.filename}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {post.replies?.length > 0 && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="replies">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  {t.studentcomm_post_view_replies_prefix} {post.replies.length} {t.studentcomm_post_view_replies_suffix}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {post.replies.map((reply) => {
                  const isHeadmasterReply = !reply.student && !reply.teacher;
                  const isAuthor =
                    (post.teacher &&
                      reply.teacher?._id === post.teacher._id) ||
                    (!post.teacher && isHeadmasterReply);

                  return (
                    <div
                      key={reply._id}
                      className={`flex items-start gap-3 border-2 px-2 py-4 rounded-xl ${
                        isHeadmasterReply
                          ? "border-purple-500 bg-purple-50/10"
                          : "border-gray-100"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          className={`text-xs ${
                            isHeadmasterReply ? "bg-purple-600 text-white" : ""
                          }`}
                        >
                          {reply.student?.full_name?.charAt(0).toUpperCase() ||
                            reply.teacher?.full_name?.charAt(0).toUpperCase() ||
                            "H"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={`text-sm flex items-center gap-2 ${
                            reply.student?._id === studentInfo._id ||
                            reply.teacher?._id === studentInfo._id
                              ? "font-extrabold"
                              : " font-semibold"
                          }`}
                        >
                          {reply.student?.full_name ||
                            reply.teacher?.full_name ||
                            (isHeadmasterReply
                              ? t.studentcomm_badge_headmaster || "Headmaster"
                              : "Unknown")}{" "}
                          {(reply.student?._id === studentInfo._id ||
                            reply.teacher?._id === studentInfo._id) && (
                            <>
                              <Badge variant={"default"}>
                                {t.studentcomm_reply_you}
                              </Badge>
                            </>
                          )}
                          {isHeadmasterReply && (
                            <Badge
                              variant="default"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {t.studentcomm_badge_headmaster || "Headmaster"}
                            </Badge>
                          )}
                          {reply?.teacher && (
                            <Badge variant={"destructive"}>
                              {t.studentcomm_reply_teacher}
                            </Badge>
                          )}
                          {reply?.student && (
                            <Badge variant={"secondary"}>
                              {t.studentcomm_reply_student}
                            </Badge>
                          )}
                          {isAuthor && (
                            <Badge variant={"outline"}>
                              {t.studentcomm_reply_author}
                            </Badge>
                          )}
                          <span className="text-gray-600">•</span>
                          <p
                            className="text-xs font-normal text-gray-400"
                            title={
                              reply.createdAt.split("T")[0] +
                              " " +
                              reply.createdAt.split("T")[1].split(".")[0]
                            }
                          >
                            {formatRelativeTime(reply.createdAt)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground">
                            {reply.content}
                          </p>
                          {reply.files && reply.files.length > 0 && (
                            <>
                              <div className="flex justify-start items-center">
                                <span className="px-4 py-2 shadow-lg rounded-lg text-gray-500 font-semibold flex justify-center gap-2 bg-purple-100">
                                  <span>{t.studentcomm_reply_with_files}</span>
                                  <Paperclip className="w-4 h-5" />
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      <CardFooter>
        <form onSubmit={handleReplySubmit} className="w-full">
          {/* --- IMPROVED: File display with remove button --- */}
          {file && (
            <div className="mb-2">
              <div className="flex items-center justify-between w-fit gap-2 px-2 py-1 rounded-full border bg-muted text-sm">
                <span className="max-w-[200px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-0.5 rounded-full hover:bg-destructive/20"
                  aria-label="Remove file"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <div className="flex w-full items-center gap-2">
            <Input
              placeholder={
                post.canReply === false
                  ? t.studentcomm_reply_placeholder_disabled
                  : t.studentcomm_reply_placeholder_enabled
              }
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              disabled={loadingReply || post.canReply === false}
            />

            <Button
              asChild
              size="icon"
              variant={file ? "default" : "outline"}
              disabled={loadingReply || post.canReply === false}
            >
              <label htmlFor={`file-upload-${post._id}`}>
                <Paperclip className="w-4 h-4" />
                <input
                  id={`file-upload-${post._id}`}
                  ref={fileInputRef} // Assign ref
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={loadingReply || post.canReply === false}
                />
              </label>
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={
                loadingReply || !newReply.trim() || post.canReply === false
              }
            >
              {loadingReply ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

// --- Skeleton ---
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

// --- Main Component ---
const StudentCommunity = ({
  studentInfo,
  getFreshToken,
}: StudentCommunityProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>
    ("All"); // NEW: State for selected teacher filter
  const { t, isRTL } = useLanguage()

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getFreshToken();
      if (!token) throw new Error("Authentication error");
      const data = await getCommunityPostsStudents(token);
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
    fetchPosts();
  };

  useEffect(() => {
    if (studentInfo) fetchPosts();
  }, [studentInfo]);

  const sortedPosts = useMemo(() => {
    let postsFiltredTeachers = selectedTeacherId==="All"? [...posts]: [...posts].filter((p) => p.teacher?._id === selectedTeacherId || (selectedTeacherId === "HEADMASTER" && !p.teacher));
    return postsFiltredTeachers.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [posts, sortOrder,selectedTeacherId]);


    // --- NEW: Extract unique teachers ---
  const allTeachers: any[] = useMemo(() => {
    const uniqueTeachers = new Map<string, any>();
    posts.forEach((post) => {
      if (post.teacher) {
          if (!uniqueTeachers.has(post.teacher._id)) {
            uniqueTeachers.set(post.teacher._id, post.teacher);
          }
      } else {
          // It's a headmaster post
          if (!uniqueTeachers.has("HEADMASTER")) {
              uniqueTeachers.set("HEADMASTER", { _id: "HEADMASTER", full_name: "Headmaster" });
          }
      }
    });
    // Convert map values to an array for the select dropdown
    return Array.from(uniqueTeachers.values());
  }, [posts]);

  const renderContent = () => {
    if (loading) return [...Array(3)].map((_, i) => <PostSkeleton key={i} />);
    if (error)
      return (
        <div className="text-center text-red-500 bg-red-50 p-6 rounded-lg">
          <p className="font-semibold mb-2">⚠ {t.studentcomm_error_title}</p>
          <p className="text-sm mb-4">{error}</p>
          <Button variant="destructive" onClick={fetchPosts}>
            <RefreshCw className="w-4 h-4 mr-2" /> {t.studentcomm_error_btn}
          </Button>
        </div>
      );
    if (posts.length === 0)
      return (
        <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
          <h3 className="text-lg font-semibold">{t.studentcomm_noposts_title}</h3>
          <p>{t.studentcomm_noposts_desc}</p>
        </div>
      );

    return sortedPosts.map((post) => (
      <PostCard
        key={post._id}
        post={post}
        onReplyAdded={handleReplyAdded}
        getFreshToken={getFreshToken}
        studentInfo={studentInfo}
      />
    ));
  };




  return (
    <div className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.studentcomm_feed_title}</h1>
          <p className="text-muted-foreground">
            {t.studentcomm_feed_subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="default" onClick={fetchPosts}>
            <RefreshCw /> {t.studentcomm_btn_refresh}
          </Button>
          <div className="flex gap-2 items-center px-2">
            <span>{t.studentcomm_sorting_prefix}</span>
            <Button
              variant="outline"
              onClick={() =>
                setSortOrder((old) => (old === "newest" ? "oldest" : "newest"))
              }
            >
              {sortOrder === "newest" ? "newest" : "oldest"}
            </Button>
          </div>
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select
          value={selectedTeacherId}
          onValueChange={setSelectedTeacherId}
          disabled={allTeachers.length === 0}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.studentcomm_filter_placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">{t.studentcomm_filter_all}</SelectItem>
            {allTeachers.map((teacher) => (
              <SelectItem key={teacher._id} value={teacher._id}>
                {teacher.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
        </div>
      </header>

      <main className="space-y-6">{renderContent()}</main>
    </div>
  );
};

export default StudentCommunity;
