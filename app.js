(function () {
  "use strict";

  const DATA = window.COURSE_DATA;
  const STORAGE_KEY = "dsa-summer-runway-v1";
  const DATA_VERSION = "2026-07-13.1";
  const TYPE_LABELS = {
    learn: "新知",
    code: "实现",
    problem: "LeetCode",
    review: "曲线复习",
    source: "课内训练"
  };

  if (!DATA) {
    document.body.textContent = "课程数据加载失败。请确认 data.js 与 index.html 位于同一目录。";
    return;
  }

  const elements = {
    progressMetric: document.querySelector("#progressMetric"),
    overallProgress: document.querySelector("#overallProgress"),
    completedMetric: document.querySelector("#completedMetric"),
    todoMetric: document.querySelector("#todoMetric"),
    daysLeftMetric: document.querySelector("#daysLeftMetric"),
    leetcodeMetric: document.querySelector("#leetcodeMetric"),
    leetcodeTotal: document.querySelector("#leetcodeTotal"),
    dateRunway: document.querySelector("#dateRunway"),
    syllabusList: document.querySelector("#syllabusList"),
    sourceDetail: document.querySelector("#sourceDetail"),
    dailyTitle: document.querySelector("#dailyTitle"),
    dailySummary: document.querySelector("#dailySummary"),
    selectedWeekLabel: document.querySelector("#selectedWeekLabel"),
    awayNotice: document.querySelector("#awayNotice"),
    completedLane: document.querySelector("#completedLane"),
    todoLane: document.querySelector("#todoLane"),
    completedList: document.querySelector("#completedList"),
    todoList: document.querySelector("#todoList"),
    completedCount: document.querySelector("#completedCount"),
    todoCount: document.querySelector("#todoCount"),
    reviewCount: document.querySelector("#reviewCount"),
    reviewList: document.querySelector("#reviewList"),
    problemList: document.querySelector("#problemList"),
    quoteText: document.querySelector("#quoteText"),
    quoteAuthor: document.querySelector("#quoteAuthor"),
    previousDay: document.querySelector("#previousDay"),
    nextDay: document.querySelector("#nextDay"),
    todayButton: document.querySelector("#todayButton"),
    themeButton: document.querySelector("#themeButton"),
    themeIcon: document.querySelector("#themeIcon"),
    exportButton: document.querySelector("#exportButton"),
    toggleProblems: document.querySelector("#toggleProblems"),
    resetButton: document.querySelector("#resetButton"),
    resetDialog: document.querySelector("#resetDialog"),
    confirmReset: document.querySelector("#confirmReset"),
    moveDialog: document.querySelector("#moveDialog"),
    moveForm: document.querySelector("#moveForm"),
    moveTaskName: document.querySelector("#moveTaskName"),
    moveDate: document.querySelector("#moveDate"),
    confirmMove: document.querySelector("#confirmMove"),
    celebration: document.querySelector("#celebration"),
    toast: document.querySelector("#toast")
  };

  let draggedTaskId = null;
  let movingTaskId = null;
  let showAllProblems = false;
  let toastTimer = null;
  let celebrationTimer = null;
  let state = loadState();

  function parseDate(dateString) {
    return new Date(`${dateString}T12:00:00`);
  }

  function toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(dateString, amount) {
    const date = parseDate(dateString);
    date.setDate(date.getDate() + amount);
    return toDateString(date);
  }

  function diffDays(first, second) {
    return Math.round((parseDate(first) - parseDate(second)) / 86400000);
  }

  function dateRange(start, end) {
    const dates = [];
    let cursor = start;
    while (cursor <= end) {
      dates.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return dates;
  }

  function isAwayDate(dateString) {
    return dateString >= DATA.blackout.start && dateString <= DATA.blackout.end;
  }

  function clampDate(dateString) {
    if (dateString < DATA.startDate) return DATA.startDate;
    if (dateString > DATA.endDate) return DATA.endDate;
    return dateString;
  }

  function initialSelectedDate() {
    return clampDate(toDateString(new Date()));
  }

  function buildInitialTasks() {
    const tasks = [];
    DATA.weeks.forEach((week) => {
      week.days.forEach((day, dayIndex) => {
        day.tasks.forEach((task, taskIndex) => {
          tasks.push({
            id: task.id || `w${week.number}-d${dayIndex + 1}-t${taskIndex + 1}`,
            sourceWeek: week.number,
            sourceDay: dayIndex + 1,
            originalDate: day.date,
            scheduledDate: day.date,
            type: task.type,
            title: task.title,
            detail: task.detail,
            duration: task.duration,
            problem: task.problem || null,
            source: task.source || week.sources[0],
            status: "todo",
            completedAt: null,
            generated: false,
            reviewOf: null,
            reviewStage: null,
            mistake: false
          });
        });
      });
    });
    return tasks;
  }

  function createDefaultState() {
    return {
      version: DATA_VERSION,
      selectedDate: initialSelectedDate(),
      theme: "dark",
      quoteIndex: Math.floor(Math.random() * DATA.quotes.length),
      tasks: buildInitialTasks()
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.version === DATA_VERSION && Array.isArray(saved.tasks)) {
        return saved;
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return createDefaultState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function formatLongDate(dateString) {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long"
    }).format(parseDate(dateString));
  }

  function formatShortDate(dateString) {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric"
    }).format(parseDate(dateString));
  }

  function formatWeekday(dateString) {
    return new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(parseDate(dateString));
  }

  function getWeekForDate(dateString) {
    return DATA.weeks.find((week) => dateString >= week.startDate && dateString <= week.endDate) || null;
  }

  function getDayPlan(dateString) {
    for (const week of DATA.weeks) {
      const day = week.days.find((entry) => entry.date === dateString);
      if (day) return { week, day };
    }
    return null;
  }

  function getTasksForDate(dateString) {
    return state.tasks
      .filter((task) => task.scheduledDate === dateString)
      .sort((first, second) => {
        const order = { review: 0, learn: 1, code: 2, source: 3, problem: 4 };
        return (order[first.type] ?? 9) - (order[second.type] ?? 9);
      });
  }

  function render() {
    document.documentElement.dataset.theme = state.theme;
    elements.themeIcon.textContent = state.theme === "dark" ? "◐" : "◑";
    renderMetrics();
    renderRunway();
    renderSyllabus();
    renderDaily();
    renderReviews();
    renderProblems();
    renderQuote();
    saveState();
  }

  function renderMetrics() {
    const coreTasks = state.tasks.filter((task) => !task.generated);
    const coreCompleted = coreTasks.filter((task) => task.status === "completed").length;
    const completed = state.tasks.filter((task) => task.status === "completed").length;
    const todo = state.tasks.length - completed;
    const percent = coreTasks.length ? Math.round((coreCompleted / coreTasks.length) * 100) : 0;
    const problemTasks = state.tasks.filter((task) => task.problem);
    const solvedProblems = problemTasks.filter((task) => task.status === "completed").length;

    elements.progressMetric.textContent = `${percent}%`;
    elements.overallProgress.value = percent;
    elements.overallProgress.textContent = `${percent}%`;
    elements.completedMetric.textContent = String(completed);
    elements.todoMetric.textContent = String(todo);
    elements.daysLeftMetric.textContent = `${remainingStudyDays()} 天`;
    elements.leetcodeMetric.textContent = String(solvedProblems);
    elements.leetcodeTotal.textContent = `计划 ${problemTasks.length} 题`;
  }

  function remainingStudyDays() {
    const today = clampDate(toDateString(new Date()));
    return dateRange(today, DATA.endDate).filter((date) => !isAwayDate(date)).length;
  }

  function renderRunway() {
    elements.dateRunway.replaceChildren();
    dateRange(DATA.startDate, DATA.endDate).forEach((dateString) => {
      const dayTasks = getTasksForDate(dateString);
      const isCleared = dayTasks.length > 0 && dayTasks.every((task) => task.status === "completed");
      const week = getWeekForDate(dateString);
      const button = createElement("button", "date-cell");
      button.type = "button";
      button.dataset.date = dateString;
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-label", `${formatLongDate(dateString)}，${dayTasks.length} 项任务`);
      if (dateString === state.selectedDate) button.classList.add("is-selected");
      if (isAwayDate(dateString)) button.classList.add("is-away");
      if (isCleared) button.classList.add("is-cleared");

      button.append(
        createElement("span", "", formatWeekday(dateString)),
        createElement("strong", "", String(parseDate(dateString).getDate())),
        createElement("small", "", isAwayDate(dateString) ? "AWAY" : week ? `W${week.number} · ${dayTasks.length}` : `BUFFER · ${dayTasks.length}`)
      );

      button.addEventListener("click", () => selectDate(dateString));
      button.addEventListener("dragover", (event) => {
        event.preventDefault();
        button.classList.add("is-drag-target");
      });
      button.addEventListener("dragleave", () => button.classList.remove("is-drag-target"));
      button.addEventListener("drop", (event) => {
        event.preventDefault();
        button.classList.remove("is-drag-target");
        if (draggedTaskId) moveTask(draggedTaskId, dateString);
      });

      elements.dateRunway.append(button);
    });

    const selected = elements.dateRunway.querySelector(".is-selected");
    if (selected) selected.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  function renderSyllabus() {
    elements.syllabusList.replaceChildren();
    const selectedTasks = getTasksForDate(state.selectedDate);
    const selectedWeekNumbers = new Set(selectedTasks.map((task) => task.sourceWeek));
    const calendarWeek = getWeekForDate(state.selectedDate);
    if (calendarWeek) selectedWeekNumbers.add(calendarWeek.number);

    DATA.weeks.forEach((week) => {
      const button = createElement("button", "week-item");
      button.type = "button";
      if (selectedWeekNumbers.has(week.number)) button.classList.add("is-active");
      button.append(
        createElement("span", "", `W${week.number} · ${week.title}`),
        createElement("small", "", week.shortFocus)
      );
      button.addEventListener("click", () => selectDate(week.startDate));
      elements.syllabusList.append(button);
    });

    const detailWeek = DATA.weeks.find((week) => selectedWeekNumbers.has(week.number)) || DATA.weeks[0];
    renderSourceDetail(detailWeek);
  }

  function renderSourceDetail(week) {
    elements.sourceDetail.replaceChildren();
    elements.sourceDetail.append(
      createElement("p", "eyebrow", `W${week.number} evidence`),
      createElement("h3", "", week.title),
      createElement("p", "", week.hardPoint || week.shortFocus)
    );
    const sourceList = createElement("ul");
    week.sources.forEach((source) => {
      const item = createElement("li");
      item.append(createElement("code", "", source));
      sourceList.append(item);
    });
    elements.sourceDetail.append(sourceList);
  }

  function renderDaily() {
    const tasks = getTasksForDate(state.selectedDate);
    const completed = tasks.filter((task) => task.status === "completed");
    const todo = tasks.filter((task) => task.status !== "completed");
    const plan = getDayPlan(state.selectedDate);
    const sourceWeeks = [...new Set(tasks.map((task) => `W${task.sourceWeek}`))];

    elements.dailyTitle.textContent = formatLongDate(state.selectedDate);
    elements.selectedWeekLabel.textContent = sourceWeeks.length ? sourceWeeks.join(" + ") : isAwayDate(state.selectedDate) ? "Away week" : "Buffer day";
    elements.dailySummary.textContent = isAwayDate(state.selectedDate)
      ? "这一天不排学习任务。真正的休息也是计划的一部分。"
      : plan
        ? plan.day.summary
        : tasks.length
          ? "这里收纳了调整到当天的任务。"
          : "没有预设任务。保留为空白，或把其他日期的任务拖到这里。";
    elements.awayNotice.hidden = !isAwayDate(state.selectedDate);
    elements.completedCount.textContent = String(completed.length);
    elements.todoCount.textContent = String(todo.length);
    elements.previousDay.disabled = state.selectedDate === DATA.startDate;
    elements.nextDay.disabled = state.selectedDate === DATA.endDate;

    renderTaskList(elements.completedList, completed, "完成区为空。把做完的任务拖进来，或点击完成。");
    renderTaskList(elements.todoList, todo, isAwayDate(state.selectedDate) ? "今天属于你，不属于任务列表。" : "待办已清空。做得漂亮。");
  }

  function renderTaskList(container, tasks, emptyMessage) {
    container.replaceChildren();
    if (!tasks.length) {
      container.append(createElement("p", "empty-state", emptyMessage));
      return;
    }
    tasks.forEach((task) => container.append(createTaskCard(task)));
  }

  function createTaskCard(task) {
    const card = createElement("article", "task-card");
    card.draggable = true;
    card.dataset.taskId = task.id;
    if (task.status === "completed") card.classList.add("is-completed");

    const meta = createElement("div", "task-meta");
    meta.append(
      createElement("span", "task-type", TYPE_LABELS[task.type] || task.type),
      createElement("span", "", `${task.duration} min`)
    );

    const title = createElement("h4", "task-title", task.title);
    const detail = createElement("p", "task-detail", task.detail);
    const actions = createElement("div", "task-actions");
    const shift = createShiftLabel(task);
    const buttons = createElement("div");

    if (task.problem) {
      const problemLink = createElement("a", "mini-button", `LC ${task.problem.number}`);
      problemLink.href = `https://leetcode.com/problems/${task.problem.slug}/`;
      problemLink.target = "_blank";
      problemLink.rel = "noopener noreferrer";
      problemLink.setAttribute("aria-label", `打开 LeetCode ${task.problem.number} ${task.problem.title}`);
      buttons.append(problemLink);

      const mistakeButton = createElement("button", `mini-button mistake-button ${task.mistake ? "is-active" : ""}`.trim(), task.mistake ? "已记错题" : "记错题");
      mistakeButton.type = "button";
      mistakeButton.addEventListener("click", () => toggleMistake(task.id));
      buttons.append(mistakeButton);
    }

    const moveButton = createElement("button", "mini-button", "改期");
    moveButton.type = "button";
    moveButton.addEventListener("click", () => openMoveDialog(task.id));

    const completeButton = createElement(
      "button",
      `mini-button ${task.status === "completed" ? "" : "complete-button"}`.trim(),
      task.status === "completed" ? "撤销" : "完成"
    );
    completeButton.type = "button";
    completeButton.addEventListener("click", () => toggleTask(task.id));
    buttons.append(moveButton, completeButton);

    actions.append(shift, buttons);
    card.append(meta, title, detail, actions);

    card.addEventListener("dragstart", (event) => {
      draggedTaskId = task.id;
      card.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", task.id);
    });
    card.addEventListener("dragend", () => {
      draggedTaskId = null;
      card.classList.remove("is-dragging");
      document.querySelectorAll(".is-drag-target").forEach((element) => element.classList.remove("is-drag-target"));
    });

    return card;
  }

  function createShiftLabel(task) {
    const difference = diffDays(task.scheduledDate, task.originalDate);
    if (difference > 0) return createElement("span", "shift-label is-delayed", `delayed ${difference} days`);
    if (difference < 0) return createElement("span", "shift-label is-ahead", `${Math.abs(difference)} days ahead`);
    return createElement("span", "shift-label", task.generated ? `D+${task.reviewStage}` : `W${task.sourceWeek} · on track`);
  }

  function renderReviews() {
    const reviews = state.tasks
      .filter((task) => task.type === "review" && task.status !== "completed")
      .sort((first, second) => first.scheduledDate.localeCompare(second.scheduledDate));
    const visible = reviews.filter((task) => task.scheduledDate <= addDays(state.selectedDate, 7)).slice(0, 6);
    elements.reviewCount.textContent = String(reviews.length);
    elements.reviewList.replaceChildren();

    if (!visible.length) {
      elements.reviewList.append(createElement("p", "empty-state", "完成一项新知后，会自动生成 D+1 / D+3 / D+7 / D+14 复习。"));
      return;
    }

    visible.forEach((task) => {
      const item = createElement("button", "compact-item");
      item.type = "button";
      item.append(
        createElement("span", "compact-index", `D+${task.reviewStage}`),
        compactCopy(task.title, `${formatShortDate(task.scheduledDate)} · ${task.duration} min`),
        createElement("span", "compact-status", task.scheduledDate <= state.selectedDate ? "DUE" : "NEXT")
      );
      item.addEventListener("click", () => selectDate(task.scheduledDate));
      elements.reviewList.append(item);
    });
  }

  function compactCopy(title, subtitle) {
    const copy = createElement("span");
    copy.append(createElement("strong", "", title), createElement("small", "", subtitle));
    return copy;
  }

  function renderProblems() {
    const problems = state.tasks
      .filter((task) => task.problem)
      .sort((first, second) => first.originalDate.localeCompare(second.originalDate));
    const visible = showAllProblems ? problems : problems.slice(0, 7);
    elements.problemList.replaceChildren();
    elements.toggleProblems.textContent = showAllProblems ? "收起" : "查看全部";

    visible.forEach((task) => {
      const item = createElement("a", "compact-item");
      item.href = `https://leetcode.com/problems/${task.problem.slug}/`;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
      item.append(
        createElement("span", "compact-index", `#${task.problem.number}`),
        compactCopy(task.problem.title, `W${task.sourceWeek} · ${task.problem.difficulty}`),
        createElement(
          "span",
          `compact-status ${task.status === "completed" && !task.mistake ? "is-done" : ""}`.trim(),
          task.mistake ? "MISTAKE" : task.status === "completed" ? "DONE" : "TODO"
        )
      );
      elements.problemList.append(item);
    });
  }

  function renderQuote() {
    const quote = DATA.quotes[state.quoteIndex % DATA.quotes.length];
    elements.quoteText.textContent = `“${quote.text}”`;
    elements.quoteAuthor.textContent = `— ${quote.author}`;
  }

  function selectDate(dateString) {
    state.selectedDate = clampDate(dateString);
    render();
    document.querySelector("#daily-plan").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function moveTask(taskId, dateString) {
    if (isAwayDate(dateString)) {
      showToast("8 月 19–25 日是外出缓冲带。请把任务放到其他日期。");
      return;
    }
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    task.scheduledDate = dateString;
    state.selectedDate = dateString;
    showToast(buildShiftMessage(task));
    render();
  }

  function buildShiftMessage(task) {
    const difference = diffDays(task.scheduledDate, task.originalDate);
    if (difference > 0) return `任务已延后 ${difference} 天。`;
    if (difference < 0) return `任务已提前 ${Math.abs(difference)} 天。`;
    return "任务已回到原计划日期。";
  }

  function setTaskStatus(taskId, status, completionDate) {
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    const wasTodo = task.status !== "completed";
    task.status = status;
    task.completedAt = status === "completed" ? (completionDate || state.selectedDate) : null;
    if (status === "completed" && completionDate && task.scheduledDate !== completionDate) {
      task.scheduledDate = completionDate;
      state.selectedDate = completionDate;
    }

    if (status === "completed" && task.type === "learn") createReviewTasks(task);
    if (status !== "completed" && task.type === "learn") {
      state.tasks = state.tasks.filter((entry) => entry.reviewOf !== task.id || entry.status === "completed");
    }

    render();
    if (wasTodo && status === "completed") {
      advanceQuote();
      const tasksToday = getTasksForDate(state.selectedDate);
      if (tasksToday.length && tasksToday.every((entry) => entry.status === "completed")) triggerCelebration();
    }
  }

  function toggleTask(taskId) {
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    setTaskStatus(taskId, task.status === "completed" ? "todo" : "completed", task.status === "completed" ? null : initialSelectedDate());
  }

  function toggleMistake(taskId) {
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task || !task.problem) return;
    task.mistake = !task.mistake;
    render();
    showToast(task.mistake ? "已加入错题台账。再次点击可移除。" : "已从错题台账移除。");
  }

  function createReviewTasks(sourceTask) {
    [1, 3, 7, 14].forEach((interval) => {
      const reviewId = `review-${sourceTask.id}-${interval}`;
      if (state.tasks.some((task) => task.id === reviewId)) return;
      let reviewDate = addDays(sourceTask.completedAt || sourceTask.scheduledDate, interval);
      while (isAwayDate(reviewDate) && reviewDate <= DATA.endDate) reviewDate = addDays(reviewDate, 1);
      if (reviewDate > DATA.endDate) return;

      state.tasks.push({
        id: reviewId,
        sourceWeek: sourceTask.sourceWeek,
        sourceDay: sourceTask.sourceDay,
        originalDate: reviewDate,
        scheduledDate: reviewDate,
        type: "review",
        title: `复盘｜${sourceTask.title}`,
        detail: `不重看整章：先闭卷说出定义、复杂度或代码骨架，再用原资料核对。`,
        duration: interval >= 7 ? 15 : 10,
        problem: null,
        source: sourceTask.source,
        status: "todo",
        completedAt: null,
        generated: true,
        reviewOf: sourceTask.id,
        reviewStage: interval,
        mistake: false
      });
    });
  }

  function advanceQuote() {
    state.quoteIndex = (state.quoteIndex + 1 + Math.floor(Math.random() * Math.max(1, DATA.quotes.length - 1))) % DATA.quotes.length;
    renderQuote();
    saveState();
  }

  function openMoveDialog(taskId) {
    const task = state.tasks.find((entry) => entry.id === taskId);
    if (!task) return;
    movingTaskId = taskId;
    elements.moveTaskName.textContent = task.title;
    elements.moveDate.value = task.scheduledDate;
    elements.moveDialog.showModal();
  }

  function handleMoveSubmit(event) {
    event.preventDefault();
    if (!movingTaskId || !elements.moveDate.value) return;
    const targetDate = elements.moveDate.value;
    if (isAwayDate(targetDate)) {
      showToast("外出周不接收任务，请换一个日期。");
      return;
    }
    elements.moveDialog.close();
    moveTask(movingTaskId, targetDate);
    movingTaskId = null;
  }

  function triggerCelebration() {
    clearTimeout(celebrationTimer);
    elements.celebration.hidden = false;
    celebrationTimer = setTimeout(() => {
      elements.celebration.hidden = true;
    }, 1850);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    toastTimer = setTimeout(() => {
      elements.toast.hidden = true;
    }, 2600);
  }

  function bindLane(lane, status) {
    lane.addEventListener("dragover", (event) => {
      event.preventDefault();
      lane.classList.add("is-drag-target");
    });
    lane.addEventListener("dragleave", (event) => {
      if (!lane.contains(event.relatedTarget)) lane.classList.remove("is-drag-target");
    });
    lane.addEventListener("drop", (event) => {
      event.preventDefault();
      lane.classList.remove("is-drag-target");
      if (!draggedTaskId) return;
      const task = state.tasks.find((entry) => entry.id === draggedTaskId);
      if (task && task.scheduledDate !== state.selectedDate) task.scheduledDate = state.selectedDate;
      setTaskStatus(draggedTaskId, status, status === "completed" ? state.selectedDate : null);
    });
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dsa-summer-progress-${toDateString(new Date())}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("进度备份已导出。文件只保存在你的设备上。");
  }

  function changeDay(amount) {
    selectDate(addDays(state.selectedDate, amount));
  }

  function bindEvents() {
    elements.previousDay.addEventListener("click", () => changeDay(-1));
    elements.nextDay.addEventListener("click", () => changeDay(1));
    elements.todayButton.addEventListener("click", () => selectDate(initialSelectedDate()));
    elements.themeButton.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      render();
    });
    elements.exportButton.addEventListener("click", exportProgress);
    elements.toggleProblems.addEventListener("click", () => {
      showAllProblems = !showAllProblems;
      renderProblems();
    });
    elements.resetButton.addEventListener("click", () => elements.resetDialog.showModal());
    elements.confirmReset.addEventListener("click", (event) => {
      event.preventDefault();
      state = createDefaultState();
      localStorage.removeItem(STORAGE_KEY);
      elements.resetDialog.close();
      render();
      showToast("进度已恢复为初始计划。此前导出的备份不受影响。");
    });
    elements.moveForm.addEventListener("submit", handleMoveSubmit);
    elements.confirmMove.addEventListener("click", handleMoveSubmit);
    bindLane(elements.completedLane, "completed");
    bindLane(elements.todoLane, "todo");

    document.addEventListener("keydown", (event) => {
      if (event.target instanceof HTMLInputElement || elements.moveDialog.open || elements.resetDialog.open) return;
      if (event.key === "[") changeDay(-1);
      if (event.key === "]") changeDay(1);
      if (event.key.toLowerCase() === "t") elements.themeButton.click();
    });
  }

  bindEvents();
  render();
})();
