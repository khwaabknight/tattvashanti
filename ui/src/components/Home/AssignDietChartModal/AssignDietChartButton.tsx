import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { GrTemplate } from "react-icons/gr";
import AssignDietChartModal from "./AssignDietChartModal";
import { ClientType } from "@/types";

type AssignDietChartButtonProps = {
    client: ClientType
}
function AssignDietChartButton({client}: AssignDietChartButtonProps) {
  return (
    <Dialog>
        <DialogTrigger asChild>
        <Button className='gap-3'>
            <GrTemplate />
            <p>Assign Diet Chart</p>
        </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-h-[100vh] max-w-screen-2xl overflow-y-auto">
            <AssignDietChartModal client={client} />
        </DialogContent>
    </Dialog>
  )
}

export default AssignDietChartButton