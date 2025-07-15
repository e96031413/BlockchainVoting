import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ElectionChart from '../../components/ElectionChart';

describe('選舉圖表組件測試', () => {
  const mockCandidates = [
    { id: '1', name: '張三', description: '候選人1描述', votes: 120 },
    { id: '2', name: '李四', description: '候選人2描述', votes: 85 },
    { id: '3', name: '王五', description: '候選人3描述', votes: 67 }
  ];
  
  const totalVotes = 272; // 120 + 85 + 67
  
  test('渲染柱狀圖', () => {
    render(
      <ElectionChart 
        candidates={mockCandidates}
        totalVotes={totalVotes}
        chartType="bar"
      />
    );
    
    // 檢查候選人名稱是否顯示
    expect(screen.getByText('張三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText('王五')).toBeInTheDocument();
    
    // 檢查票數和百分比是否顯示
    expect(screen.getByText('120 票 (44%)')).toBeInTheDocument();
    expect(screen.getByText('85 票 (31%)')).toBeInTheDocument();
    expect(screen.getByText('67 票 (25%)')).toBeInTheDocument();
  });
  
  test('渲染餅圖', () => {
    render(
      <ElectionChart 
        candidates={mockCandidates}
        totalVotes={totalVotes}
        chartType="pie"
      />
    );
    
    // 檢查圖例是否顯示
    expect(screen.getByText('張三')).toBeInTheDocument();
    expect(screen.getByText(/\(44%\)/)).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText(/\(31%\)/)).toBeInTheDocument();
    expect(screen.getByText('王五')).toBeInTheDocument();
    expect(screen.getByText(/\(25%\)/)).toBeInTheDocument();
  });
  
  test('渲染環形圖', () => {
    render(
      <ElectionChart 
        candidates={mockCandidates}
        totalVotes={totalVotes}
        chartType="donut"
      />
    );
    
    // 檢查總票數是否顯示在環形圖中心
    expect(screen.getByText('272')).toBeInTheDocument();
    expect(screen.getByText('總票數')).toBeInTheDocument();
    
    // 檢查圖例是否顯示
    expect(screen.getByText('張三')).toBeInTheDocument();
    expect(screen.getByText(/\(44%\)/)).toBeInTheDocument();
  });
  
  test('處理零票情況', () => {
    const noCandidates = [
      { id: '1', name: '張三', description: '候選人1描述', votes: 0 },
      { id: '2', name: '李四', description: '候選人2描述', votes: 0 }
    ];
    
    render(
      <ElectionChart 
        candidates={noCandidates}
        totalVotes={0}
        chartType="bar"
      />
    );
    
    // 檢查候選人名稱是否顯示
    expect(screen.getByText('張三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    
    // 檢查票數和百分比是否顯示為零
    // 使用 getAllByText 而不是 getByText，因為可能有多個元素包含相同文本
    const zeroVoteElements = screen.getAllByText('0 票 (0%)');
    expect(zeroVoteElements.length).toBeGreaterThan(0);
  });
});
