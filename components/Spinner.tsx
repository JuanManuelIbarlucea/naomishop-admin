import { BarLoader } from "react-spinners";
import { LoaderHeightWidthProps } from "react-spinners/helpers/props";

export default function Spinner(props: LoaderHeightWidthProps) {
  return <BarLoader {...props} />;
}
