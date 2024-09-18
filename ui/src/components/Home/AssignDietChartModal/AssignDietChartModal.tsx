import { ClientDietChartType, ClientType } from "@/types"
import api from "@/utils/axiosConfig";
import { useState } from "react";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import Step1Form from "./Step1Form";
import DietChartTable from "../DietChartTable";
import convertArrayToStructuredDietChart from "@/utils/convertArrayToStructuredDietChart";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { DialogClose } from "@/components/ui/dialog";

type AssignDietChartModalProps = {
    client: ClientType
}

function AssignDietChartModal({client}: AssignDietChartModalProps) {
  const [step, setStep] = useState(1);

  const [dietChartItems, setDietChartItems] = useState<ClientDietChartType>({
    _id: '',
    user: '',
    startDate: new Date(),
    endDate: new Date(),
    items: []
  });

  const createDietChart = (dietChartParameters:{
    cuisine: string,
    deficit: string,
    startDate: Date,
    endDate: Date
  }) => {
    api.post('api/v1/dietChart', {...dietChartParameters,userId: client._id})
      .then((res) => {
        if(!res.data.dietChart) {
          toast.error('An empty diet chart was created')
          return;
        }
        setDietChartItems(res.data.dietChart)
        setStep(2);
      })
      .catch((err) => {
        console.log(err)
        toast.error('Failed to create diet chart')
      })
  }

  const sendEmail = () => {
    api.get(`api/v1/dietChart/sendEmail/${dietChartItems._id}`)
      .then(_ => {
        toast.success('Email sent successfully')
      })
      .catch((err) => {
        console.log(err)
        toast.error('Failed to send email')
      })
  }

  return (
    <div>
      <div className="flex items-baseline gap-10">
        <h2 className="text-5xl">
          Assign a diet chart to <span className="font-semibold">{client.name}</span>
          <sup>
            {client.gender === 'FEMALE' && <IoMdFemale className="text-pink-500 font-semibold inline"/>}
            {client.gender === 'MALE' && <IoMdMale className="text-blue-500 font-semibold inline"/>}
          </sup>
        </h2>
        <p className="text-gray-500 text-3xl">{client.email}</p>
      </div>

      {
        step === 1 && (
          <Step1Form
            createDietChart={createDietChart}
          />
        )
      }

      {
        step === 2 && (
          <div>
            <h2 className="text-xl font-semibold">Step 2: Choose a diet chart</h2>
            <div>
              <DietChartTable
                dietChartId={dietChartItems._id}
                initialDietChartArray={convertArrayToStructuredDietChart(dietChartItems.items)}
                submitHandler={() => {}}
                isBaseDietChart={false}
              />
            </div>
            <Button type="button" onClick={() => setStep(1)} className="bg-gray-500 text-white px-3 py-1 rounded-lg">Back</Button>
            <Button type="button" onClick={() => setStep(3)} className="bg-blue-500 text-white px-3 py-1 rounded-lg">Next</Button>
          </div>
        )
      }

      {
        step === 3 && (
          <div>
            <h2 className="text-xl font-semibold">Diet chart assigned successfully</h2>
            <Button type="button" onClick={() => setStep(2)} className="bg-blue-500 text-white px-3 py-1 rounded-lg">Back</Button>
            <DialogClose asChild>
              <Button type="button" onClick={sendEmail} className="bg-gray-500 text-white px-3 py-1 rounded-lg">Send Email</Button>
            </DialogClose>
            <Button type="button" onClick={() => setStep(1)} className="bg-gray-500 text-white px-3 py-1 rounded-lg">Assign another</Button>
          </div>
        )
      }
        
    </div>
  )
}

export default AssignDietChartModal