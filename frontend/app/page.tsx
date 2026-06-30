'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from './supabase';

// Mapコンポーネントに area プロパティを追加
const MapComponent = dynamic<{ center: [number, number]; zoom: number; dangerLocations: any[]; area: "nayoro" | "kamikawa" }>(
  () => import('./Map'),
  { ssr: false }
);

const AREA_CENTERS: Record<"nayoro" | "kamikawa", { name: string; center: [number, number]; zoom: number }> = {
  nayoro: { name: "名寄市", center: [44.354864923838576, 142.47165399066333], zoom: 14 },
  kamikawa: { name: "上川郡", center: [43.8471022270575, 142.77016876640985], zoom: 14 }
};

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<"nayoro" | "kamikawa">("nayoro");
  const [dbDangerLocations, setDbDangerLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as "nayoro" | "kamikawa";
    console.log("【ログ】1. エリアが変更されました:", value);
    setSelectedArea(value);
  };

  useEffect(() => {
    const fetchCases = async () => {
      console.log("【ログ】2. データ取得処理を開始。対象エリア:", selectedArea);
      setIsLoading(true);
      setDbDangerLocations([]); // 古いサークルをクリア
      
      try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        console.log("【ログ】3. Supabaseへ通信を開始します...");
        
        // 標準的かつ安全なデータ取得処理
        const { data, error } = await supabase
          .from('Location_data')
          .select('*')
          .eq('area_name', selectedArea)
          .gt('create_at', oneMonthAgo.toISOString());
        
        console.log("【ログ】4. Supabaseから応答あり。error:", error, "データ件数:", data ? data.length : 0);

        if (error) { 
          console.error("【エラー】データ取得エラー詳細:", error);
        } else if (data) {
          setDbDangerLocations(data);
        }
      } catch (e) {
        console.error("【エラー】システムエラーが発生しました:", e);
      } finally {
        console.log("【ログ】5. finallyブロック通過。isLoadingをfalseにします。");
        setIsLoading(false); 
      }
    };

    fetchCases();
  }, [selectedArea]);

  const caseCount: number = dbDangerLocations.length;
  const currentMonth = new Date().getMonth() + 1;

  let level = "低";
  let badgeColor = "#22c55e";
  let description = "現在、被害報告はなく、時期的にもダニの活動は極めて不活発とされています。";

  if (isLoading) {
    level = "確認中";
    badgeColor = "#9ca3af";
    description = "最新のデータを取得しています...";
  } 
  else if (caseCount > 0) {
    level = "高";
    badgeColor = "#ef4444";
    description = `ダニの被害発生件数： ${caseCount}件。一見の発生でも周囲に多数潜んでいると考えるのが自然です。事前の想定と早めの対処をおすすめします。`;
  } 
  else if (caseCount === 0 && (currentMonth >= 5 && currentMonth <= 10)) {
    level = "中";
    badgeColor = "#f97316"; 
    description = "現在の被害報告はありませんが、ダニの活動が注目される時期です。草むらには十分ご注意ください。";
  }

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <select
        value={selectedArea} 
        onChange={handleAreaChange} 
        className='absolute top-5 right-5 z-[1000] p-2 bg-white rounded shadow'
      >
        <option value="nayoro">名寄市</option>
        <option value="kamikawa">上川郡</option>
      </select>

      {/* isLoadingがfalseの時のみマップを描画することで安全性を確保 */}
      {!isLoading && (
        <MapComponent 
          center={AREA_CENTERS[selectedArea].center}
          zoom={AREA_CENTERS[selectedArea].zoom}
          dangerLocations={dbDangerLocations}
          area={selectedArea}
        />
      )}

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '350px',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderLeft: `5px solid ${badgeColor}`,
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
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
        
        {/* selectedAreaに直結させ、表示のズレを完全に防ぐ */}
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