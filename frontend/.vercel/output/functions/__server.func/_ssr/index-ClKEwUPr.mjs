import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, B as Button, j as cn, i as buttonVariants, s as supabase } from "./router-BFWygh1D.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { A as AppShell } from "./app-shell-B9H2tZp4.mjs";
import { b as todayISODateIST, p as parseISODate, t as toISODate, i as isWeekend, a as isWithinBookingWindow, f as formatDateLong, c as canCancel, d as daysFromTodayIST } from "./date-utils-DlrBZFJO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as CalendarDays, M as Map$1, j as CircleX, e as ChevronLeft, f as ChevronRight, d as ChevronDown, i as CircleCheck } from "../_libs/lucide-react.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "../_libs/react-day-picker.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/date-fns.mjs";
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const [yearDropdownOpen, setYearDropdownOpen] = reactExports.useState(false);
  const [currentMonth, setCurrentMonth] = reactExports.useState(props.month || /* @__PURE__ */ new Date());
  reactExports.useEffect(() => {
    if (props.month) {
      setCurrentMonth(props.month);
    }
  }, [props.month]);
  const handleYearSelect = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setYearDropdownOpen(false);
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
  };
  const handleMonthChange = (date) => {
    setCurrentMonth(date);
    if (props.onMonthChange) {
      props.onMonthChange(date);
    }
  };
  const currentYear = currentMonth.getFullYear();
  const yearRange = Array.from({ length: 16 }, (_, i) => currentYear - 5 + i);
  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    handleMonthChange(newDate);
  };
  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    handleMonthChange(newDate);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2.25rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      month: currentMonth,
      onMonthChange: handleMonthChange,
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        formatWeekdayName: (date) => date.toLocaleString("default", { weekday: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "hidden",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50 hover:bg-accent/50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50 hover:bg-accent/50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-1",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium flex items-center gap-1 text-sm",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse border-spacing-0",
        weekdays: cn("flex w-full", defaultClassNames.weekdays),
        weekday: cn(
          "text-primary flex-1 select-none text-center text-xs font-bold py-1",
          defaultClassNames.weekday
        ),
        week: cn("mt-1.5 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md border-2 border-primary data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        CaptionLabel: ({ children }) => {
          const monthName = currentMonth.toLocaleString("default", { month: "long" });
          const year = currentMonth.getFullYear();
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-bold text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handlePreviousMonth,
                className: "hover:bg-accent/50 rounded p-1 transition-colors",
                "aria-label": "Previous month",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: monthName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: yearDropdownOpen, onOpenChange: setYearDropdownOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "hover:text-primary hover:underline cursor-pointer transition-colors",
                  children: year
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-16 p-0", align: "center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto py-1", children: yearRange.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleYearSelect(y),
                  className: cn(
                    "w-full px-2 py-2 text-center text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                    y === currentYear && "bg-accent font-medium"
                  ),
                  children: y
                },
                y
              )) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleNextMonth,
                className: "hover:bg-accent/50 rounded p-1 transition-colors",
                "aria-label": "Next month",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
              }
            )
          ] });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none rounded-md hover:bg-accent/50 transition-all data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarView, {}) });
}
function CalendarView() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const today = todayISODateIST();
  const [selected, setSelected] = reactExports.useState(parseISODate(today));
  const {
    data: holidays = []
  } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_holidays").select("holiday_date, holiday_name");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: myBookings = [],
    refetch: refetchBookings
  } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_bookings").select("id, booking_date, desk_id, status, office_desks(desk_code, office_zones(zone_code))").eq("user_id", user.id).eq("status", "confirmed").gte("booking_date", today).order("booking_date", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const holidayMap = new Map(holidays.map((h) => [h.holiday_date, h.holiday_name]));
  const bookingMap = new Map(myBookings.map((b) => [b.booking_date, b]));
  const selectedISO = selected ? toISODate(selected) : void 0;
  const status = selectedISO ? evaluateDate(selectedISO, holidayMap) : null;
  const existingBooking = selectedISO ? bookingMap.get(selectedISO) : null;
  const canOpenMap = !!selectedISO && (!!existingBooking || status?.kind === "ok");
  const handleCancel = async (bookingId, dateIso) => {
    if (!canCancel(dateIso)) {
      toast.error("Cancellation closed (after 6 PM IST on booking day)");
      return;
    }
    const {
      error
    } = await supabase.from("office_bookings").update({
      status: "cancelled",
      cancelled_by_user_id: user?.id
    }).eq("id", bookingId);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking cancelled");
      refetchBookings();
    }
  };
  const openDeskMap = () => {
    if (!selectedISO) return;
    navigate({
      to: "/book/$date",
      params: {
        date: selectedISO
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 lg:grid-cols-[minmax(360px,0.95fr)_minmax(360px,1.05fr)] xl:gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-xl border-2 border-primary/25 bg-card p-4 shadow-lg shadow-primary/10 ring-1 ring-white/70 sm:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Pick a desk booking date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Choose a bookable workday." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden rounded-full bg-primary/10 p-2 text-primary sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex min-h-[31rem] w-full max-w-[30rem] items-center justify-center rounded-xl border border-primary/20 bg-background/85 p-4 shadow-inner sm:min-h-[32rem] sm:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { mode: "single", selected, onSelect: setSelected, showOutsideDays: false, className: "mx-auto w-full rounded-lg bg-card p-4 shadow-sm [--cell-size:2.5rem] sm:[--cell-size:2.75rem]", classNames: {
        root: "w-full",
        months: "w-full",
        month: "w-full",
        table: "w-full border-separate border-spacing-0",
        weekdays: "grid grid-cols-7 gap-x-2 gap-y-2",
        weekday: "flex h-8 items-center justify-center rounded-md text-xs font-bold text-primary",
        weeks: "flex flex-col gap-2",
        week: "grid grid-cols-7 gap-x-2",
        day: "aspect-square p-0",
        today: "rounded-lg bg-primary/10 text-primary ring-2 ring-primary/35 [&_button]:font-semibold",
        disabled: "rounded-lg bg-muted/45 text-muted-foreground/45 opacity-100 ring-1 ring-border [&_button]:cursor-not-allowed",
        day_button: "h-full w-full rounded-lg border border-border bg-background/80 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 data-[selected-single=true]:rounded-lg data-[selected-single=true]:border-primary data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground"
      }, disabled: (d) => {
        const iso = toISODate(d);
        return !isWithinBookingWindow(iso);
      }, modifiers: {
        holiday: (d) => holidayMap.has(toISODate(d)),
        weekend: (d) => isWeekend(toISODate(d)),
        booked: (d) => bookingMap.has(toISODate(d))
      }, modifiersClassNames: {
        holiday: "rounded-lg bg-destructive/15 text-destructive ring-2 ring-destructive/30 hover:bg-destructive/20 [&_button]:rounded-lg [&_button]:border-destructive/40 [&_button]:bg-destructive/10 [&_button]:text-destructive",
        weekend: "rounded-lg bg-muted/40 text-muted-foreground/55 ring-1 ring-border [&_button]:border-border [&_button]:bg-muted/35 [&_button]:text-muted-foreground/70",
        booked: "rounded-lg bg-primary/15 text-primary ring-2 ring-primary/45 [&_button]:rounded-lg [&_button]:border-primary/60 [&_button]:bg-primary/15 [&_button]:text-primary"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-1.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "bg-primary", label: "You have a booking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "bg-muted-foreground/40", label: "Weekend / unavailable" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "bg-destructive", label: "Public holiday" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: "Selected date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-xl font-semibold sm:text-2xl", children: selectedISO ? formatDateLong(selectedISO) : "No date selected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: existingBooking ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: {
              kind: "booked"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "rounded-full border-primary/25 bg-primary/10 text-primary", children: [
              "Desk ",
              formatDeskLabel(existingBooking)
            ] })
          ] }) : status && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-2 sm:w-auto sm:min-w-48", children: [
          canOpenMap && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2 bg-primary hover:bg-primary/90", onClick: openDeskMap, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Map$1, { className: "h-4 w-4" }),
            "Browse desks"
          ] }),
          existingBooking && canCancel(selectedISO) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive", onClick: () => handleCancel(existingBooking.id, selectedISO), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
            "Cancel booking"
          ] }),
          existingBooking && !canCancel(selectedISO) && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "justify-center rounded-full py-1.5", children: "Cancellation locked" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: "Your upcoming bookings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-full", children: myBookings.length })
        ] }),
        myBookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border bg-muted/25 p-4 text-sm text-muted-foreground", children: "No upcoming bookings." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: myBookings.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid gap-3 rounded-xl border border-border/70 bg-background/55 p-3 sm:grid-cols-[76px_1fr_auto] sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase", children: parseISODate(b.booking_date).toLocaleDateString(void 0, {
              month: "short"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-semibold leading-none", children: parseISODate(b.booking_date).getDate() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-base font-semibold", children: [
              "Desk ",
              formatDeskLabel(b)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDateLong(b.booking_date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-full bg-success/20 text-success-foreground", children: "Confirmed" })
            ] })
          ] }),
          canCancel(b.booking_date) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto", onClick: () => handleCancel(b.id, b.booking_date), children: "Cancel" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "w-fit rounded-full", children: "Locked" })
        ] }, b.id)) })
      ] })
    ] })
  ] });
}
function LegendDot({
  color,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block h-2.5 w-2.5 rounded-full ${color}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
  ] });
}
function evaluateDate(iso, holidays) {
  if (daysFromTodayIST(iso) < 0) return {
    kind: "past"
  };
  if (!isWithinBookingWindow(iso)) return {
    kind: "too-far"
  };
  if (isWeekend(iso)) return {
    kind: "weekend"
  };
  if (holidays.has(iso)) return {
    kind: "holiday",
    name: holidays.get(iso)
  };
  return {
    kind: "ok"
  };
}
function StatusBadge({
  status
}) {
  if (status.kind === "ok") return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "rounded-full bg-success/25 text-success-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
    "Available"
  ] });
  if (status.kind === "booked") return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-full bg-primary text-primary-foreground", children: "Confirmed booking" });
  if (status.kind === "past") return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full", children: "Past date" });
  if (status.kind === "weekend") return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full", children: "Weekend — bookings disabled" });
  if (status.kind === "too-far") return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full", children: "Only 7 days ahead allowed" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "rounded-full bg-destructive/15 text-destructive", children: [
    "Holiday: ",
    status.name
  ] });
}
function formatDeskLabel(booking) {
  const zone = booking.office_desks?.office_zones?.zone_code;
  const desk = booking.office_desks?.desk_code;
  if (zone && desk) return `${zone}-${desk}`;
  return desk ?? "—";
}
export {
  HomePage as component
};
