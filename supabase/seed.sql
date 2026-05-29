insert into public.resources (section, seat_number, label, kind)
select 'A', seat_number, 'A-' || seat_number, 'desk'::public.resource_kind
from generate_series(1, 18) as seat_number
on conflict (section, seat_number) do nothing;

insert into public.resources (section, seat_number, label, kind)
select 'B', seat_number, 'B-' || seat_number, 'desk'::public.resource_kind
from generate_series(1, 12) as seat_number
on conflict (section, seat_number) do nothing;

insert into public.resources (section, seat_number, label, kind)
select 'MR', seat_number, 'MR-' || seat_number, 'meeting_room'::public.resource_kind
from generate_series(1, 7) as seat_number
on conflict (section, seat_number) do nothing;
