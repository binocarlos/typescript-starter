import React, { FC, ReactNode } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import {
  TableSchema,
} from '../../types/app'

const useStyles = makeStyles(theme => createStyles({
  root: {
    width: '100%',
  },
  table: {
    
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  autoCell: {
    width: 'auto'
  },
}))

interface SimpleTableProps {
  data: Record<string, any>[],
  fields: TableSchema,
  actionsFieldClassname?: string,
  hideHeaderIfEmpty?: boolean,
  hideHeader?: boolean,
  getActions?: {
    (row: Record<string, any>): ReactNode,
  },
  onRowClick?: {
    (row: Record<string, any>): void,
  },
}

const SimpleTable: FC<SimpleTableProps> = ({
  data,
  fields,
  getActions, 
  onRowClick,
  hideHeaderIfEmpty,
  hideHeader,
  actionsFieldClassname,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          {
            (!hideHeader && (!hideHeaderIfEmpty || data.length > 0)) && (
              <TableHead>
                <TableRow>
                  {
                    fields.map((field, i) => {
                      return (
                        <TableCell key={ i } align={ field.numeric ? 'right' : 'left' }>
                          { field.title }
                        </TableCell>
                      )
                    })
                  }
                  {
                    getActions ? (
                      <TableCell align='right'>
                        Actions
                      </TableCell>
                    ) : null
                  }
                </TableRow>
              </TableHead>
            )
          }
          <TableBody>
            {data.map((dataRow, i) => {
              return (
                <TableRow
                  hover
                  onClick={e => {
                    if(!onRowClick) return
                    onRowClick(dataRow)
                  }}
                  tabIndex={-1}
                  key={ i }
                >
                  {
                    fields.map((field, i) => {
                      return (
                        <TableCell 
                          key={ i } 
                          align={ field.numeric ? 'right' : 'left' } 
                          className={ field.className || classes.autoCell }
                        >
                          { dataRow[field.name] }
                        </TableCell>
                      )
                    })
                  }
                  {
                    getActions ? (
                      <TableCell align='right' className={ actionsFieldClassname }>
                        { getActions(dataRow) }
                      </TableCell>
                    ) : null
                  }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default SimpleTable