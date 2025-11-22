import { AdminLayout } from "@/Components/Templates";
import RankingCO2 from "./RankingCO2";

export default function RankingsCO2(){
    return(
       <AdminLayout 
          pageTitle="Ranking"
          pageSubtitle="De los mejores usuarios">
          <RankingCO2 />
        </AdminLayout>
    );
}