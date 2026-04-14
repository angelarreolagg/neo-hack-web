import { IEvent } from "@/database";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const event: IEvent = await response.json();
  return (
    <div>
      <h3>{event.title}</h3>
    </div>
  );
};

export default EventDetailsPage;
