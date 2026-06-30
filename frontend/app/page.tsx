'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from './supabase';

// Mapコンポーネントを、ブラウザ側でのみ読み込む
const MapComponent = dynamic<{ center: [number, number]; zoom: number; dangerLocations: any[] }>(
  () => import('./Map'),
  { ssr: false }
);



const AREA_CENTERS: Record<"nayoro" | "kamikawa", { name: string; center: [number, number]; zoom: number }> = {
  nayoro: { name: "名寄市", center: [44.354864923838576, 142.47165399066333], zoom: 14 },
  kamikawa: { name: "上川郡", center: [43.8471022270575, 142.77016876640985], zoom: 14 }
};

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<"nayoro" | "kamikawa" > ("nayoro");
  
  const [dbDangerLocations, setDbDangerLocations] = useState<any[]>([]);

  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedArea(event.target.value as "nayoro" | "kamikawa");
  };

  useEffect(()=> {
    const fetchCases = async() => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);

      const {data, error} = await supabase
        .from('Location_data')
        .select('*')
        .eq('area_name',selectedArea)
        .gt('create_at',oneMonthAgo.toISOString());
      
        if (error) { 
          console.error("データ取得エラー:", error);
        }
        else if (data){
          setDbDangerLocations(data);
        }
    };

    fetchCases();
  }, [selectedArea]);

  const caseCount:number = dbDangerLocations.length;
  const currentMonth = new Date().getMonth() + 1;

  let level = "低";
  let badgeColor = "#22c55e";
  let description = "現在、被害報告はなく、時期的にもダニの活動は極めて不活発とされています。";

  if (caseCount > 0){
    level = "高";
    badgeColor = "#ef4444";
    description = `ダニの被害発生件数： ${caseCount}件。一見の発生でも周囲に多数潜んでいると考えるのが自然です。事前の想定と早めの対処をおすすめします。`;

  }
  else if (caseCount === 0 && (currentMonth >= 5 && currentMonth <= 10)) {
    level = "中";
    badgeColor = "#f97316";
    description = "現在被害報告はありませんが、ダニの活動が活発な時期です。草むらに入る際は十分にご注意ください。"
  }

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* 画面上に地域を選択するセレクトボックスを置く */}
      <select onChange={handleAreaChange} className='absolute top-5 right-5 z-[1000] p-2 bg-white rounded shadow"'>
        <option value="nayoro">名寄市</option>
        <option value="kamikawa">上川郡</option>
      </select>

      {/* 地図の表示 */}
      {dbDangerLocations && (
        <MapComponent 
          center={AREA_CENTERS[selectedArea].center}
          zoom={AREA_CENTERS[selectedArea].zoom}
          dangerLocations={dbDangerLocations}
        />
      )}

      {/* 左上の警戒レベルパネル */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '350px',
        zIndex: 1000, // 地図より手前に出す
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderLeft: `5px solid ${badgeColor}`,
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* 警戒レベルバッジ */}
        <div style={{
          backgroundColor: badgeColor,
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          display: 'inline-block',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          警戒レベル：{level}
        </div>
        
        <h1 style={{ fontSize: '20px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
          {AREA_CENTERS[selectedArea].name} <br />危険エリア最新情報
        </h1>

        <p style={{ fontSize: '13px', color: '#333', margin: 0, lineHeight: '1.6' }}>
          {description}
        </p>
      </div>
    </main>
  );
}