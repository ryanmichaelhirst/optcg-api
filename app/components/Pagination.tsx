import { useSearchParams } from "@remix-run/react"

import { SEARCH_PARAM_KEYS } from "@/utils/search-params"
import { IconChevronLeftPipe, IconChevronRight, IconChevronRightPipe } from "@tabler/icons-react"

import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function Pagination(props: {
  perPage: number
  page: number
  total: number
  onPerPage?: (value: number) => void
  onFirstPage?: (value: number) => void
  onPrevPage?: (value: number) => void
  onNextPage?: (value: number) => void
  onLastPage?: (value: number) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const lastPage = Math.ceil(props.total / props.perPage)

  const isPrevDisabled = props.page <= 1
  const isNextDisabled = props.page + 1 > lastPage

  const startItem = props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1; // prettier-ignore
  const endItem = props.total === 0 ? 0 : startItem + props.perPage - 1

  return (
    <div className={"flex items-center justify-between"}>
      <div className="flex basis-1/3 items-center space-x-2 text-sm text-muted-foreground">
        <div>
          <Select
            value={String(props.perPage)}
            onValueChange={(value) => {
              if (props.onPerPage) {
                props.onPerPage(Number(value))
              } else {
                searchParams.set(SEARCH_PARAM_KEYS.PER_PAGE, value)
                searchParams.set(SEARCH_PARAM_KEYS.PAGE, String(1))
                setSearchParams(searchParams)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"5"}>5</SelectItem>
              <SelectItem value={"10"}>10</SelectItem>
              <SelectItem value={"20"}>20</SelectItem>
              <SelectItem value={"50"}>50</SelectItem>
              <SelectItem value={"100"}>100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>per page</div>
      </div>
      <span className="text-sm text-muted-foreground">
        {startItem}-{endItem > props.total ? props.total : endItem} of {props.total} rows
      </span>
      <div className="flex basis-1/3 items-center justify-end space-x-1">
        <Button
          variant={"link"}
          size="sm"
          className={isPrevDisabled ? "pointer-events-none text-muted-foreground opacity-25" : ""}
          disabled={isPrevDisabled}
          onClick={() => {
            if (props.onFirstPage) {
              props.onFirstPage(1)
            } else {
              searchParams.set(SEARCH_PARAM_KEYS.PER_PAGE, String(props.perPage))
              searchParams.set(SEARCH_PARAM_KEYS.PAGE, String(1))
              setSearchParams(searchParams)
            }
          }}
        >
          <IconChevronLeftPipe className="h-5 w-5" />
        </Button>
        <Button
          variant={"link"}
          size="sm"
          className={isPrevDisabled ? "pointer-events-none text-muted-foreground opacity-25" : ""}
          disabled={isPrevDisabled}
          onClick={() => {
            if (props.onPrevPage) {
              props.onPrevPage(props.page > 1 ? props.page - 1 : 1)
            } else {
              searchParams.set(SEARCH_PARAM_KEYS.PER_PAGE, String(props.perPage))
              searchParams.set(
                SEARCH_PARAM_KEYS.PAGE,
                props.page > 1 ? String(props.page - 1) : String(1),
              )
              setSearchParams(searchParams)
            }
          }}
        >
          <IconChevronLeftPipe className="h-5 w-5" />
        </Button>
        <Button
          variant={"link"}
          size="sm"
          className={isNextDisabled ? "pointer-events-none text-muted-foreground opacity-25" : ""}
          disabled={isNextDisabled}
          onClick={() => {
            if (props.onNextPage) {
              props.onNextPage(props.page + 1)
            } else {
              searchParams.set(SEARCH_PARAM_KEYS.PER_PAGE, String(props.perPage))
              searchParams.set(SEARCH_PARAM_KEYS.PAGE, String(props.page + 1))
              setSearchParams(searchParams)
            }
          }}
        >
          <IconChevronRight className="h-5 w-5" />
        </Button>
        <Button
          variant={"link"}
          size="sm"
          className={isNextDisabled ? "pointer-events-none text-muted-foreground opacity-25" : ""}
          disabled={isNextDisabled}
          onClick={() => {
            if (props.onLastPage) {
              props.onLastPage(lastPage)
            } else {
              searchParams.set(SEARCH_PARAM_KEYS.PER_PAGE, String(props.perPage))
              searchParams.set(SEARCH_PARAM_KEYS.PAGE, String(lastPage))
              setSearchParams(searchParams)
            }
          }}
        >
          <IconChevronRightPipe className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
