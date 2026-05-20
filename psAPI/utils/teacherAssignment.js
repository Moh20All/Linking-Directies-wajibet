import Group from "../models/groupe.model.js";
import { Teacher } from "../models/teacher.model.js";

export async function assignTeacherToGroup({ groupId, teacherId, moduleId }) {
  const group = await Group.findOne({ id: groupId });
  const teacher = await Teacher.findById(teacherId);
  if (!group || !teacher) return;

  const alreadyAssigned = teacher.currentGroups.some(
    (g) =>
      String(g.groupId) === String(groupId) &&
      String(g.moduleId) === String(moduleId)
  );

  if (!alreadyAssigned) {
    // update group side
    group.teachers.push({ teacherId, moduleId });

    // update teacher side
    teacher.currentGroups.push({ groupId, moduleId });
    teacher.teachingHistory.push({
      groupId,
      moduleId,
      reason: "assigned",
      timestamp: new Date(),
    });

    await Promise.all([group.save(), teacher.save()]);
  }
}

export async function unassignTeacherFromGroup({
  groupId,
  teacherId,
  moduleId,
}) {
  const group = await Group.findOne({ id: groupId });
  const teacher = await Teacher.findById(teacherId);
  if (!group || !teacher) return;

  // normalize to string for comparison
  group.teachers = group.teachers.filter(
    (t) =>
      !(
        String(t.teacherId) === String(teacherId) &&
        String(t.moduleId) === String(moduleId)
      )
  );

  teacher.currentGroups = teacher.currentGroups.filter(
    (g) =>
      !(
        String(g.groupId) === String(groupId) &&
        String(g.moduleId) === String(moduleId)
      )
  );

  teacher.teachingHistory.push({
    groupId,
    moduleId,
    reason: "removed",
    timestamp: new Date(),
  });

  await Promise.all([group.save(), teacher.save()]);
}
