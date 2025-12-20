import { formatDistanceToNow } from "date-fns";

const TimeAgo = ({ date }) => {
  return <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>;
};
export default TimeAgo;