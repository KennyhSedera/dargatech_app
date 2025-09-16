<?php

namespace App\Services;

class ChartService
{
    private function formatChartData($data): array
    {
        if (isset($data[0]) && is_array($data[0]) && isset($data[0]['date']) && isset($data[0]['total'])) {
            $labels = [];
            foreach ($data as $row) {
                $labels[] = date('d-m-y', strtotime($row['date']));
            }
            $values = array_column($data, 'total');
            return [$labels, $values];
        }

        $labels = array_keys($data);

        foreach ($labels as &$label) {
            if (strtotime($label)) {
                $label = date('d-m', strtotime($label));
            }
        }

        return [$labels, array_values($data)];
    }

    private function getChartOptions(string $type, string $title, string $labelY, string $labelX): array
    {
        $commonOptions = [
            'title' => [
                'display' => true,
                'text' => $title,
                'fontSize' => 16,
                'fontColor' => '#333'
            ],
            'legend' => [
                'display' => false
            ]
        ];

        if ($type === 'line') {
            return array_merge($commonOptions, [
                'scales' => [
                    'yAxes' => [
                        [
                            'ticks' => [
                                'beginAtZero' => true,
                                'stepSize' => 1
                            ],
                            'scaleLabel' => [
                                'display' => true,
                                'labelString' => $labelY
                            ]
                        ]
                    ],
                    'xAxes' => [
                        [
                            'scaleLabel' => [
                                'display' => true,
                                'labelString' => $labelX
                            ]
                        ]
                    ]
                ],
                'elements' => [
                    'point' => [
                        'radius' => 4,
                        'backgroundColor' => '#333'
                    ],
                    'line' => [
                        'tension' => 0.2
                    ]
                ]
            ]);
        }

        if ($type === 'bar') {
            return array_merge($commonOptions, [
                'scales' => [
                    'yAxes' => [
                        [
                            'ticks' => [
                                'beginAtZero' => true,
                                'stepSize' => 1
                            ],
                            'scaleLabel' => [
                                'display' => true,
                                'labelString' => $labelY
                            ]
                        ]
                    ],
                    'xAxes' => [
                        [
                            'scaleLabel' => [
                                'display' => true,
                                'labelString' => $labelX
                            ]
                        ]
                    ]
                ]
            ]);
        }

        if ($type === 'pie') {
            return array_merge($commonOptions, [
                'responsive' => true,
                'legend' => [
                    'display' => true,
                    'position' => 'right'
                ]
            ]);
        }

        return $commonOptions;
    }

    public function generateChartUrl($data, $color = '#45a049', $title = 'Tableau de Bord', $labelY = 'Nombre', $labelX = 'Date', $type = 'bar')
    {
        list($labels, $values) = $this->formatChartData($data);

        $dataset = [
            'label' => 'Nombre',
            'data' => $values,
            'borderColor' => $color,
            'borderWidth' => 2
        ];

        if ($type === 'line') {
            $dataset['backgroundColor'] = 'transparent';
            $dataset['fill'] = false;
        } elseif ($type === 'pie') {
            $dataset['backgroundColor'] = [
                '#4CAF50',
                '#FF9800',
                '#2196F3',
                '#E91E63',
                '#9C27B0'
            ];
        } else {
            $dataset['backgroundColor'] = $color;
        }

        $chartConfig = [
            'type' => $type,
            'data' => [
                'labels' => $labels,
                'datasets' => [$dataset]
            ],
            'options' => $this->getChartOptions($type, $title, $labelY, $labelX)
        ];

        return 'https://quickchart.io/chart?width=500&height=350&c=' . urlencode(json_encode($chartConfig));
    }
}
