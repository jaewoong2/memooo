'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Angry, GlassWaterIcon, MoonIcon, SaladIcon, SmileIcon, StarIcon, SunIcon, XCircleIcon } from 'lucide-react'

type Props = {}

const HabbitForm = (props: Props) => {
  const [habitName, setHabitName] = useState('');
  const [habitType, setHabitType] = useState('');

  return (
    <div>
        <div className="my-4">
      
        </div>
        <div className="my-4">
            <p className='text-sm py-1 px-1'>내 습관</p>
            {habitType === '추가' && 
            <label className='relative'>
                <Input
                    placeholder="습관 이름을 입력하세요"
                    className='flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                />
                <Button 
                onClick={() => setHabitType('')}
                className='right-0 top-0 absolute hover:bg-transparent' variant='ghost' type='button'><XCircleIcon /> </Button>
            </label>
            }
            {habitType !== '추가' && <Select onValueChange={(value) => setHabitType(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="내 습관" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="건강">건강</SelectItem>
                    <SelectItem value="학습">학습</SelectItem>
                    <SelectItem value="생활">생활</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                    <SelectItem value="추가">추가</SelectItem>
                </SelectContent>
            </Select>}

<div>
            <p className='text-sm py-1 px-1'>습관 아이콘</p>
            <div className='grid grid-cols-6'>
                <Button className='aspect-square w-12 h-auto p-0'><StarIcon className='w-10 h-10'/> </Button>
                <Button className='aspect-square w-12 h-auto'><SmileIcon/> </Button>
                <Button className='aspect-square w-12 h-auto'><SaladIcon/> </Button>
                <Button className='aspect-square w-12 h-auto'><GlassWaterIcon/> </Button>
                <Button className='aspect-square w-12 h-auto'><SunIcon/> </Button>
                <Button className='aspect-square w-12 h-auto'><MoonIcon/> </Button>
            </div>

</div>
        </div>
        <Button className='w-full'>다음</Button>
    </div>
  )
}

export default HabbitForm