import React, { useEffect, useRef } from 'react';

// 定義候選人類型
interface Candidate {
  id: string;
  name: string;
  description: string;
  votes: number;
}

// 組件屬性類型
interface ElectionChartProps {
  candidates: Candidate[];
  totalVotes: number;
  chartType?: 'bar' | 'pie' | 'donut';
  className?: string;
}

// 顏色配置
const colors = [
  '#3B82F6', // 藍色
  '#10B981', // 綠色
  '#F59E0B', // 橙色
  '#EF4444', // 紅色
  '#8B5CF6', // 紫色
  '#EC4899', // 粉色
  '#06B6D4', // 青色
  '#F97316', // 深橙色
];

/**
 * 選舉結果可視化圖表組件
 * 支持柱狀圖、餅圖和環形圖
 */
const ElectionChart: React.FC<ElectionChartProps> = ({
  candidates,
  totalVotes,
  chartType = 'bar',
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // 計算百分比
  const getPercentage = (votes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };
  
  // 柱狀圖渲染
  const renderBarChart = () => {
    return (
      <div className="space-y-4">
        {candidates.map((candidate, index) => {
          const percentage = getPercentage(candidate.votes);
          return (
            <div key={candidate.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{candidate.name}</span>
                <span className="text-gray-500">{candidate.votes} 票 ({percentage}%)</span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: colors[index % colors.length]
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // 餅圖/環形圖渲染
  const renderPieChart = () => {
    // 計算每個候選人的角度
    let startAngle = 0;
    const segments = candidates.map((candidate, index) => {
      const percentage = getPercentage(candidate.votes);
      const angle = (percentage / 100) * 360;
      const segment = {
        id: candidate.id,
        name: candidate.name,
        votes: candidate.votes,
        percentage,
        startAngle,
        endAngle: startAngle + angle,
        color: colors[index % colors.length]
      };
      startAngle += angle;
      return segment;
    });
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          {/* 環形圖背景（僅用於環形圖） */}
          {chartType === 'donut' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full"></div>
            </div>
          )}
          
          {/* 繪製扇形 */}
          {segments.map(segment => {
            if (segment.percentage === 0) return null;
            
            // 計算 SVG 路徑
            const radius = 32; // 半徑為 32 (64/2)
            const centerX = 32;
            const centerY = 32;
            
            const startX = centerX + radius * Math.cos((segment.startAngle - 90) * Math.PI / 180);
            const startY = centerY + radius * Math.sin((segment.startAngle - 90) * Math.PI / 180);
            const endX = centerX + radius * Math.cos((segment.endAngle - 90) * Math.PI / 180);
            const endY = centerY + radius * Math.sin((segment.endAngle - 90) * Math.PI / 180);
            
            // 大弧標誌 (large-arc-flag)
            const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
            
            // 構建路徑
            const path = `
              M ${centerX} ${centerY}
              L ${startX} ${startY}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
              Z
            `;
            
            return (
              <svg 
                key={segment.id} 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 64 64"
              >
                <path 
                  d={path} 
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            );
          })}
          
          {/* 環形圖中心文字（僅用於環形圖） */}
          {chartType === 'donut' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold">{totalVotes}</div>
              <div className="text-xs text-gray-500">總票數</div>
            </div>
          )}
        </div>
        
        {/* 圖例 */}
        <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2">
          {segments.map(segment => (
            <div key={segment.id} className="flex items-center">
              <div 
                className="w-4 h-4 mr-2 rounded-sm"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="text-sm">
                <span className="font-medium">{segment.name}</span>
                <span className="text-gray-500 ml-1">({segment.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div ref={chartRef} className={`p-4 ${className}`}>
      {chartType === 'bar' ? renderBarChart() : renderPieChart()}
    </div>
  );
};

export default ElectionChart;
