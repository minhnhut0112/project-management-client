import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '@/customLib/DndKitSensor'
import { arrayMove } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import { cloneDeep, isEmpty } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { useCallback } from 'react'
import { useRef } from 'react'
import { generatePlaceholderCard } from '@/utils/formatters'
import { useMutation } from '@tanstack/react-query'

import { moveCardToDifferentColunmnAPI, moveColumnAPI } from '@/apis/boards.api'
import { updateColumnAPI } from '@/apis/columns.api'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board }) => {
  // Di chuyen chuot 10px moi kich hoat event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  // Nhan giu 250s va di chuyen 5px moi kich hoat event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnDragingCard, setOldColumnDragingCard] = useState(null)

  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(board.columns)
  }, [board])

  const mutionMoveColumn = useMutation({
    mutationFn: (data) => {
      const { columnOrderIds } = data
      moveColumnAPI(board._id, { columnOrderIds: columnOrderIds })
    }
  })

  const mutionMoveCardInTheSameColunmn = useMutation({
    mutationFn: (data) => {
      const { oldColumnDragingCard, cardOrderIds } = data
      updateColumnAPI(oldColumnDragingCard._id, { cardOrderIds: cardOrderIds })
    }
  })

  const mutionMoveCardToDifferentColunmn = useMutation({
    mutationFn: (data) => {
      moveCardToDifferentColunmnAPI(data)
    }
  })

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDragingCardId,
    activeDragingCardData,
    triggerfrom
  ) => {
    setOrderedColumns((prevColumns) => {
      //tim noi card sap duoc tha trong column dich
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

      let newCardIndex

      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      // clone mang
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)

      if (nextActiveColumn) {
        // xoa card o column cu luc keo card ra khoi no de sang column khac
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDragingCardId)

        // them card rong neu column rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cap nhat cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }

      if (nextOverColumn) {
        // kiem tra card dang keo co ow over column chua, neu co thi xoa di
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDragingCardId)
        // cap nhat du lieu
        const rebuild_activeDragingCardData = {
          ...activeDragingCardData,
          columnId: nextOverColumn._id
        }
        // them card dang keo vao over column theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDragingCardData)
        // xoa card bi an
        nextOverColumn.cards = nextOverColumn.cards.filter((c) => !c.FE_PlaceholderCard)
        // cap nhat cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }

      if (triggerfrom === 'handeDragEnd') {
        let prevCardOrderIds = nextColumns.find((c) => c._id === oldColumnDragingCard._id)?.cardOrderIds || []
        if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

        mutionMoveCardToDifferentColunmn.mutate({
          currentCardId: activeDragingCardId,
          prevColumnId: oldColumnDragingCard._id,
          prevCardOrderIds: prevCardOrderIds,
          nextColumnId: nextOverColumn._id,
          nextCardOrderIds: nextColumns.find((c) => c._id === nextOverColumn._id)?.cardOrderIds
        })
      }

      return nextColumns
    })
  }

  // triger khi keo (drag) phan tu
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnDragingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // triger trong qua trinh keo phan tu
  const handeDragOver = (event) => {
    // khong lam gi khi keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event
    // khi keo ra ngoai pham vi container thi khong xu ly
    if (!active || !over) return
    // khi card dandg duoc keo tha
    const {
      id: activeDragingCardId,
      data: { current: activeDragingCardData }
    } = active
    // card dang tuong tac tren or duoi card duoc keo
    const { id: overCardId } = over
    // tim 2 column theo cardId

    const activeColumn = findColumnByCardId(activeDragingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDragingCardId,
        activeDragingCardData,
        'handeDragOver'
      )
    }
  }

  // triger khi tha (drog) phan tu
  const handeDragEnd = (event) => {
    const { active, over } = event

    // khi keo ra ngoai pham vi container thi khong xu ly
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDragingCardId,
        data: { current: activeDragingCardData }
      } = active
      // card dang tuong tac tren or duoi card duoc keo
      const { id: overCardId } = over
      // tim 2 column theo cardId

      const activeColumn = findColumnByCardId(activeDragingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnDragingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDragingCardId,
          activeDragingCardData,
          'handeDragEnd'
        )
      } else {
        // trong cung 1 colmn
        // lay vi tri cu tu oldColumnDragingCard
        const oldCardIndex = oldColumnDragingCard?.cards.findIndex((c) => c._id === activeDragItemId)
        // lay vi tri moi tu over
        const newCardIndex = overColumn?.cards.findIndex((c) => c._id === overCardId)
        // dung arrmove de sap xep lai card
        const dndOrderedCards = arrayMove(oldColumnDragingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)

        setOrderedColumns((prevColumns) => {
          // clone mang
          const nextColumns = cloneDeep(prevColumns)

          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)

          return nextColumns
        })

        mutionMoveCardInTheSameColunmn.mutate({ oldColumnDragingCard, cardOrderIds: dndOrderedCardIds })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      // lay vi tri cu tu active
      const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
      // lay vi tri moi tu over
      const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)
      // dung arrmove de sap xep lai column
      const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
      const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

      setOrderedColumns(dndOrderedColumns)

      mutionMoveColumn.mutate({ columnOrderIds: dndOrderedColumnsIds })
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDragingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections?.length) return

      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        const checkColumn = orderedColumns.find((c) => c._id === overId)
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId && checkColumn?.cardOrderIds.includes(container.id)
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handeDragOver}
      onDragEnd={handeDragEnd}
      collisionDetection={collisionDetectionStrategy}
      sensors={sensors}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.todolist.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} boardId={board._id} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
