//-- copyright
// OpenProject is an open source project management software.
// Copyright (C) the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
//
// See COPYRIGHT and LICENSE files for more details.
//++

import { HalResource } from 'core-app/features/hal/resources/hal-resource';
import { DisplayField } from 'core-app/shared/components/fields/display/display-field.module';
import { DisplayFieldService } from 'core-app/shared/components/fields/display/display-field.service';

/**
 * Renders the raw attribute value as-is, standing in for the real display
 * field classes (registered at bootstrap and covered by their own specs).
 * Use together with {@link stubDisplayFieldService} wherever a spec needs
 * `op-editable-attribute-field` (or `DisplayFieldRenderer`) to actually
 * render a value without pulling in the real field-type registry.
 */
export class StubDisplayField {
  constructor(private readonly attributeName:string, private resource:HalResource) {
  }

  public readonly writable = true;

  public readonly isFormattable = false;

  public readonly title:string|undefined = undefined;

  public readonly placeholder = '';

  public apply(resource:HalResource):void {
    this.resource = resource;
  }

  public render(span:HTMLElement, text:string):void {
    span.textContent = text;
  }

  public isEmpty():boolean {
    return !this.value;
  }

  public get valueString():string {
    return typeof this.value === 'string' ? this.value : '';
  }

  public get displayName():string {
    return this.attributeName;
  }

  public get name():string {
    return this.attributeName;
  }

  private get value():unknown {
    return (this.resource as unknown as Record<string, unknown>)[this.attributeName];
  }
}

/** A `DisplayFieldService` stub that hands out {@link StubDisplayField}s for any attribute. */
export function stubDisplayFieldService():Pick<DisplayFieldService, 'getField'> {
  return {
    getField: (resource:HalResource, attributeName:string) => new StubDisplayField(attributeName, resource) as unknown as DisplayField,
  };
}
