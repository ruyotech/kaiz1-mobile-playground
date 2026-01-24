# Task Epic Management - Edit Functionality

## Overview
Users can now add tasks to epics or remove them from epics through the task edit screen. The epic management interface matches the modern design from the create task screen.

---

## Features Added

### 1. Epic Management in Task Edit Screen
**File:** `app/(tabs)/sdlc/task/edit.tsx`

**New Functionality:**
- **Epic Selection** - Choose which epic to assign the task to
- **Epic Removal** - Remove task from current epic (set to standalone)
- **Epic Change** - Move task from one epic to another
- **Visual Feedback** - Change indicator shows what will happen on save

**State Management:**
- Tracks original epic ID to detect changes
- Properly adds/removes task from epic's `taskIds` array
- Updates task's `epicId` field
- Maintains data consistency between Task and Epic stores

---

## User Interface

### Epic Selector Design

**1. No Epic Option**
```
┌─────────────────────────────────────────┐
│ 📥 No Epic - Standalone Task     ✓     │
└─────────────────────────────────────────┘
```
- Inbox icon
- Gray background when selected
- Shows checkmark when active

**2. Epic Cards**
```
┌─────────────────────────────────────────┐
│ ▬▬▬▬▬▬▬▬▬ (colored stripe)              │
│ 🚀 Launch Mobile App               ✓   │
│ Build and launch the mobile version    │
└─────────────────────────────────────────┘
```
- Color stripe (1px, epic color)
- Epic icon + title
- Description preview
- Checkmark when selected (color-matched)
- Border darkens when selected

**3. Empty State**
```
┌─────────────────────────────────────────┐
│            🚀                            │
│   No epics available                    │
│   Create an epic to group tasks         │
└─────────────────────────────────────────┘
```

**4. Change Indicator**
```
┌─────────────────────────────────────────┐
│ ℹ️  Task will be added to epic          │
└─────────────────────────────────────────┘
```
- Blue info banner
- Shows when epic assignment changes
- Three messages:
  - "Task will be removed from epic"
  - "Task will be added to epic"
  - "Task will be moved to different epic"

---

## User Workflows

### Workflow 1: Add Task to Epic
```
1. User opens task detail
2. Taps edit button (pencil icon in header)
3. Scrolls to "Link to Epic" section
4. Currently shows: "No Epic - Standalone Task" ✓
5. Taps an epic card
6. Blue banner appears: "Task will be added to epic"
7. Taps "Save"
8. Task is added to epic's taskIds array
9. Task's epicId is set to epic ID
10. Returns to task detail (now shows epic badge)
```

**Result:**
- Task appears in epic's task list
- Task shows epic badge in calendar/backlog/search
- Epic's task count increases
- Epic's total points recalculate

---

### Workflow 2: Remove Task from Epic
```
1. User opens task (currently in "Launch Mobile App" epic)
2. Taps edit button
3. Scrolls to "Link to Epic" section
4. Currently shows: "Launch Mobile App" ✓
5. Taps "No Epic - Standalone Task"
6. Blue banner: "Task will be removed from epic"
7. Taps "Save"
8. Task removed from epic's taskIds
9. Task's epicId set to null
10. Returns to task detail (no epic badge)
```

**Result:**
- Task removed from epic's task list
- Epic badge disappears from all views
- Task becomes available in "Add Task" modals
- Epic's task count decreases

---

### Workflow 3: Move Task Between Epics
```
1. User opens task (in "Health Journey" epic)
2. Taps edit button
3. Scrolls to "Link to Epic" section
4. Currently shows: "Health Journey" ✓
5. Taps "Financial Independence" epic
6. Blue banner: "Task will be moved to different epic"
7. Taps "Save"
8. Task removed from old epic's taskIds
9. Task added to new epic's taskIds
10. Task's epicId updated to new epic
```

**Result:**
- Task disappears from old epic's task list
- Task appears in new epic's task list
- Epic badge updates with new color/icon
- Both epics' counts recalculate

---

## Technical Implementation

### Data Flow on Save

```typescript
handleSave() {
  // 1. Update task properties
  updateTask(taskId, {
    title,
    description,
    status,
    storyPoints,
    epicId, // Updated epic ID
    // ... other fields
  });

  // 2. Handle epic relationship changes
  if (originalEpicId !== epicId) {
    // Remove from old epic
    if (originalEpicId) {
      removeTaskFromEpic(originalEpicId, taskId);
    }
    
    // Add to new epic
    if (epicId) {
      addTaskToEpic(epicId, taskId);
    }
  }
}
```

### Store Operations

**useTaskStore:**
```typescript
updateTask(taskId, updates) {
  // Updates task.epicId in tasks array
}
```

**useEpicStore:**
```typescript
addTaskToEpic(epicId, taskId) {
  // Adds taskId to epic.taskIds array
}

removeTaskFromEpic(epicId, taskId) {
  // Removes taskId from epic.taskIds array
}
```

---

## Data Consistency

### Epic-Task Relationship
The relationship is maintained in **two places**:

1. **Task Side:** `task.epicId` (single reference)
2. **Epic Side:** `epic.taskIds[]` (array of task IDs)

**On Add:**
- ✅ Set `task.epicId = epicId`
- ✅ Push `taskId` to `epic.taskIds`

**On Remove:**
- ✅ Set `task.epicId = null`
- ✅ Filter `taskId` from `epic.taskIds`

**On Move:**
- ✅ Remove from old epic's `taskIds`
- ✅ Add to new epic's `taskIds`
- ✅ Update task's `epicId`

### Synchronization Points
1. **Create Task** - Sets epicId, adds to epic.taskIds
2. **Edit Task** - Updates both sides if changed
3. **Delete Task** - Removes from epic.taskIds (future)
4. **Delete Epic** - Sets all tasks' epicId to null (future)

---

## Access Points

### How to Edit Task Epic Assignment

**From Task Detail:**
```
Task Detail Screen
  ↓
[Pencil Icon Button] in header
  ↓
Edit Screen
  ↓
Scroll to "Link to Epic" section
  ↓
Select/deselect epic
  ↓
[Save Button]
```

**Edit Button Location:**
- Top right header
- White background with 20% opacity
- Pencil icon (MaterialCommunityIcons)
- Next to status button and more menu

---

## Visual Design

### Design Tokens

**Epic Card - Selected:**
```
Border: 2px solid gray-900
Background: white
Checkmark: Epic color
```

**Epic Card - Unselected:**
```
Border: 2px solid gray-200
Background: white
Checkmark: Hidden
```

**No Epic Button - Selected:**
```
Background: gray-100
Border: 2px solid gray-400
Icon: gray-900
```

**Change Indicator:**
```
Background: blue-50
Border: 1px solid blue-200
Text: blue-900
Icon: blue-600
```

### Layout
- Section title: Uppercase, tracked, gray-500
- Cards: 16px padding, 12px border radius
- Gap between cards: 12px
- Color stripe height: 4px

---

## Edge Cases Handled

### 1. Task Already in Epic
- Shows current epic as selected
- Selecting same epic = no change
- No change indicator shown

### 2. No Epics Exist
- Shows empty state with helpful message
- Only "No Epic" option available
- Edit still functional (can change other fields)

### 3. Epic Deleted While Editing
- Epic selector would show deleted epic initially
- On save, if epic doesn't exist, gracefully handles
- Task's epicId would become orphaned (needs cleanup)

### 4. Concurrent Edits
- Last save wins (optimistic update)
- No conflict resolution (future enhancement)

### 5. Cancel Without Saving
- originalEpicId preserved
- No store updates made
- Returns to previous state

---

## Testing Checklist

### Basic Operations
✅ Add task to epic from standalone
✅ Remove task from epic to standalone
✅ Move task from one epic to another
✅ Edit task without changing epic
✅ Cancel edit (no changes saved)

### UI Feedback
✅ Selected epic shows checkmark
✅ Change indicator appears when epic changes
✅ Correct message in change indicator
✅ Epic cards show color stripe
✅ Epic icons display correctly

### Data Integrity
✅ task.epicId updated correctly
✅ epic.taskIds includes task after add
✅ epic.taskIds excludes task after remove
✅ Old epic cleaned up on move
✅ New epic includes task on move

### Edge Cases
✅ Edit with no epics available
✅ Edit task already in epic
✅ Select same epic (no change)
✅ Empty state displays properly
✅ Long epic names don't overflow

---

## Future Enhancements

### Phase 2 - Bulk Operations
- Select multiple tasks
- Bulk assign to epic
- Bulk remove from epic
- Quick epic assignment from calendar

### Phase 3 - Advanced Features
- Recent epics list (quick access)
- Epic search in selector
- Drag and drop epic assignment
- Suggested epics based on task attributes

### Phase 4 - Smart Automation
- Auto-suggest epic based on task title
- ML-based epic categorization
- Rules engine: "Tasks with X always go to Y epic"
- Workflow templates with epic assignments

---

## User Benefits

### For Individual Users
✅ **Flexibility** - Change epic assignment anytime
✅ **Organization** - Keep tasks properly grouped
✅ **Clarity** - Always see current epic assignment
✅ **Control** - Easily remove from epic if needed

### For Power Users
✅ **Workflow Optimization** - Quickly reorganize tasks
✅ **Strategic Alignment** - Move tasks as priorities shift
✅ **Clean Architecture** - Maintain well-organized epics
✅ **Progress Tracking** - Tasks properly counted in epics

### For Product
✅ **Feature Completeness** - Full CRUD for epic-task relationships
✅ **User Confidence** - Clear feedback on what will happen
✅ **Data Quality** - Properly maintained relationships
✅ **Foundation** - Enables advanced epic features

---

## Integration Points

### Screens That Show Epic Info
1. **Task Detail** - Epic badge in overview
2. **Calendar** - Epic badge on tasks
3. **Backlog** - Epic badge in cards
4. **Search** - Epic badge in results
5. **Epic Detail** - Task list with edit option

### Screens That Modify Epic Assignment
1. **Create Task** - Initial epic selection
2. **Edit Task** - Change epic assignment ✅ NEW
3. **Epic Detail** - Add/remove tasks from epic
4. **Backlog** - (Future) Quick epic assign

---

## Summary

The task edit screen now provides complete epic management functionality with a modern, intuitive interface. Users can:

1. **Add tasks to epics** - Assign standalone tasks to strategic goals
2. **Remove from epics** - Convert epic tasks back to standalone
3. **Move between epics** - Reorganize as priorities change
4. **See what changes** - Clear feedback before saving

The implementation maintains data consistency across both Task and Epic stores, ensuring the relationship is always properly synchronized. Visual design matches the create task screen for consistency, and the change indicator provides confidence that the user knows exactly what will happen when they save.

**Key Achievement:** Complete lifecycle management of task-epic relationships through an elegant, user-friendly interface that reinforces Kaiz's philosophy of treating life like a product with strategic organization and execution.
